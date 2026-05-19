# Claude Code Course 2026

A four-session hands-on course on building with Claude. Each week you'll extend **devlens** — a small AI coding assistant that reads your project files and answers questions about your codebase.

---

## What you'll need

### Accounts
- **GitHub account** — to fork this repo and submit your work
- **Anthropic API key** — your instructor will provide one. Get it from [console.anthropic.com](https://console.anthropic.com) if you need your own.

### Software to install

**Node.js** (v18 or later)
- Download from [nodejs.org](https://nodejs.org) — install the LTS version

**Claude Code** (the CLI)
```bash
npm install -g @anthropic-ai/claude-code
```

**VS Code** (recommended editor)
- Download from [code.visualstudio.com](https://code.visualstudio.com)
- Install the **Claude Code extension** from the VS Code marketplace

---

## Getting started

**1. Fork this repo**
Click "Fork" in the top right on GitHub. This gives you your own copy to push changes to.

**2. Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/claude-code-course-2026.git
cd claude-code-course-2026
```

**3. Install dependencies**
```bash
npm install
```

**4. Add your API key**
```bash
cp .env.example .env
```
Open `.env` and replace `your-api-key-here` with the key your instructor gave you.

> **Never commit your `.env` file.** The repo already includes a `.gitignore` that blocks it, but double-check before pushing: run `git status` and make sure `.env` does not appear in the list.

**5. Run devlens**
```bash
node index.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using Claude Code with your API key

Claude Code can run using your course API key instead of a Claude.ai subscription:

```bash
export ANTHROPIC_API_KEY=your-api-key-here
claude
```

To make this persist across terminal sessions, add the export line to your `~/.zshrc` or `~/.bashrc`, then restart your terminal.

> **Note:** Your API key has a usage budget. It covers in-class work on this project — avoid using it for unrelated projects.

---

## Week 1 assignment

This week is about understanding how Claude actually works under the hood — specifically the messages array that drives every AI conversation.

### What to submit
Push two commits to your fork:

**Commit 1 — commented api.js (without CLAUDE.md)**
- Open `api.js` in your editor
- Use Claude Code to ask questions: *"What does this file do?"*, *"Walk me through the agent loop"*, *"What is the messages array?"*
- Add comments to `api.js` in your own words explaining what you learned
- Commit: `git commit -m "feat: add api.js comments"`

**Commit 2 — CLAUDE.md + rewritten comments**
- Write `CLAUDE.md` **by hand** — your background, how you learn best, how you like Claude to talk to you
- Ask Claude the same questions again — notice how the answers change
- Rewrite your comments based on the better explanations
- Commit: `git commit -m "feat: add CLAUDE.md and rewrite comments"`

The diff between your two commits *is* the assignment — it shows what personalizing Claude's context actually does.

> **Why write CLAUDE.md yourself?** Claude can write it for you — but don't let it. CLAUDE.md is the one file in this repo that has to come from you. It's what makes your codebase yours. Every other file Claude touches; this one is where you tell Claude who you are. The more honest and specific you are, the more useful every future interaction becomes. Think of it as authoring your own developer identity.

### Tips for asking Claude Code about this codebase
- *"Explain api.js to me like I've never seen an API before"*
- *"What happens step by step when I send a message in the browser?"*
- *"Why does the messages array keep growing with each turn?"*
- *"What would happen if we removed the MAX_ITERATIONS cap?"*

---

## Week 2 assignment

This week is about understanding the tool use cycle — how Claude asks your code to do things, and how your code decides whether to honor those requests.

### What to submit
Push one commit to your fork:

**An existing skill that could help you and why**
- write a short reflection on why
- create 'relfections' folder in devlens
- add reflection to fork as .txt or .md
  
**A custom skill for devlens**
- Create `.claude/skills/[your-skill-name]/SKILL.md`
- Pick one of these options (or create your own):
  - `/trace` — trace a tool call (read_file, write_file, etc.) end-to-end through the codebase
  - `/diagram` — explain the request/response flow for a specific scenario
  - `/compare` — compare how devlens implements something vs how Claude Code does it
  - `/explain-gap` — document what you learned by fixing this week's gap
- Test your skill in Claude Code to make sure it works
- Commit: `git commit -m "feat: add [skill-name] skill"`

### Standards for a good skill
Your skill should have:
1. **Specific description** — Clear enough that Claude knows when to use it
2. **Clear instructions** — Numbered steps, specific output format
3. **Examples in the instructions** — Show Claude what good output looks like
4. **Arguments where needed** — Use `$ARGUMENTS` or `$0, $1, $2` for input

### Tips for writing your skill
- Read through `tools.js` and `api.js` first to understand what you're explaining
- Use actual line numbers and file names in your skill instructions
- Test it multiple times — if Claude's output isn't what you wanted, refine the instructions
- Make it devlens-specific — it should require understanding this codebase to write it

> **Why devlens-specific?** Generic skills like `/review` can be written without reading any code. Skills like `/trace` or `/diagram` force you to understand how devlens works under the hood. The skill is evidence you understand the tool use cycle.

---

## Project structure

```
devlens/
├── index.js      # Express server — starts the app, handles /chat requests
├── api.js        # The agent loop — where the Claude API calls happen
├── tools.js      # Tools Claude can use (read files, run commands, etc.)
├── public/
│   ├── index.html  # The chat UI
│   └── style.css   # Styles
├── CLAUDE.md     # Your personal context file — fill this in!
├── .claude/
│   └── skills/   # Your custom skills live here
└── .env          # Your API key (never commit this)
```

---

## Submitting your work

Push your commits to your fork on GitHub and share the link with your instructor.

```bash
git push origin main
```
