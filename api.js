const fs = require("node:fs");
const path = require("node:path");
const Anthropic = require("@anthropic-ai/sdk");
const { toolDefinitions, handleToolCall } = require("./tools");

const MODEL = "claude-sonnet-4-6";

// Claude can chain tool calls indefinitely; this cap keeps a bug from burning your API credits
const MAX_ITERATIONS = 10;

// One client instance for the whole process — API key comes from .env, never the source file
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The system prompt is Claude's "role brief" sent with every request; CLAUDE.md adds project-specific rules on top
function loadSystemPrompt() {
  const base =
    "You are devlens, an AI assistant embedded in the user's project directory. " +
    "You have tools for reading files, writing files, running shell commands, " +
    "and listing directories. When the user asks a question that depends on the " +
    "contents of the codebase, use the tools — do not guess.";

  const claudeMdPath = path.resolve(process.cwd(), "CLAUDE.md");
  if (!fs.existsSync(claudeMdPath)) return base;

  // Injecting CLAUDE.md lets you customize Claude's behavior per project without touching this file
  const claudeMd = fs.readFileSync(claudeMdPath, "utf-8");
  return `${base}\n\n--- Project context (from CLAUDE.md) ---\n${claudeMd}`;
}

// Agentic loop: Claude may ask to run tools several times before giving a final answer;
// this function keeps driving that cycle until Claude stops requesting tools
async function chat(userMessage, history) {

  const messages = [...history, { role: "user", content: userMessage }];
  const trace = []; // Full audit trail of every text block, tool call, and result — useful when debugging

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: loadSystemPrompt(),
      tools: toolDefinitions,
      messages,
    });

    // Append Claude's reply to messages so the next API call has the full conversation context
    messages.push({ role: "assistant", content: response.content });

    // response.content is an array of blocks — each is either a "text" reply or a "tool_use" request
    for (const block of response.content) {
      if (block.type === "text") {
        trace.push({ type: "text", text: block.text });
      } else if (block.type === "tool_use") {
        trace.push({ type: "tool_use", id: block.id, name: block.name, input: block.input });
      }
    }

    const toolUses = response.content.filter((b) => b.type === "tool_use");

    // No tool requests in this response means Claude has enough info to answer — exit the loop
    if (toolUses.length === 0) {
      const reply = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return { reply, history: messages, trace, iterations: i + 1 };
    }

    // Run each tool locally and collect results to send back
    const toolResults = [];
    for (const block of toolUses) {
      const result = await handleToolCall(block.name, block.input);
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
      trace.push({ type: "tool_result", tool_use_id: block.id, name: block.name, content: result });
    }

    // Tool results are sent back as a "user" turn — that's the API contract for the tool-use cycle
    messages.push({ role: "user", content: toolResults });
  }

  // Hit the iteration cap — Claude never stopped asking for tools, so we bail out gracefully
  return {
    reply: `(Stopped after ${MAX_ITERATIONS} iterations — Claude kept asking for tools. Task may be incomplete. Raise MAX_ITERATIONS in api.js if this is expected.)`,
    history: messages,
    trace,
    iterations: MAX_ITERATIONS,
  };
}

module.exports = { chat };
