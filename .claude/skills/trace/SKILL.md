# /trace

Trace a devlens tool call end-to-end through the codebase. Use this when you want to understand how a specific tool (e.g. read_file) travels from the browser request through api.js and tools.js and back.

## Arguments

$ARGUMENTS — the tool name to trace (e.g. `read_file`, `write_file`, `run_command`, `list_files`)

## Instructions

1. Read `index.js`, `api.js`, and `tools.js`
2. Follow the path for the given tool:
   - Where the request enters (index.js /chat route)
   - How Claude gets told about the tool (toolDefinitions in api.js)
   - How the tool call gets dispatched (handleToolCall switch in tools.js)
   - What the handler returns and how it gets sent back to Claude
3. Output a numbered step list with file:line references at each step
4. End with one sentence describing what Claude actually receives as the result

## Example output for `read_file`

```
Tracing: read_file

1. [index.js:27]  POST /chat received, calls chat() in api.js
2. [api.js:38]    Claude API called with toolDefinitions — Claude sees read_file is available
3. [api.js:58]    Claude responds with a tool_use block for read_file
4. [api.js:72]    handleToolCall("read_file", { path: "..." }) called
5. [tools.js:153] Switch routes to readFile() handler
6. [tools.js:234] File read from disk, contents returned as a string
7. [api.js:73-78] Result packaged as tool_result and sent back to Claude as a user turn

Result: Claude receives the raw file contents as a plain string on the next iteration.
```
