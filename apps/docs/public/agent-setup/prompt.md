# Set up Pane in this project

You are a coding agent. The person who pasted the line that brought you here wants to build with
Pane, a design system. Work through the steps below in this project, but follow the rules first.

## Rules

1. Read before you change anything. Look at package.json, the lockfile, the framework and the entry file.
2. Then tell the person, in one short list, what you will add and which files you will touch, and ask
   once whether to go ahead. Do not ask again for each step after they say yes.
3. Install into this project only. Never install globally, never add `--yes` to a global command, and
   never change settings outside this folder unless the person asks.
4. Never read, ask for, print or store a credential, token or key. Nothing here needs an account.
5. If a step fails, stop that step, say what failed in one line, and go on with the rest.
6. Use the package manager the project already uses (pnpm, yarn, npm or bun, from its lockfile).

## 1. Check the project

It needs React 18 or newer. If package.json has no `react`, or an older one, stop and say so.
If there is no package.json, offer to start one, and do nothing until the person answers.

## 2. Install

Pane is installed from the tarball its site hosts, so the line works before the package is on a registry:

```sh
<package manager> add https://pane-design-system.pages.dev/downloads/pane-react-0.8.0.tgz
```

Then import the stylesheet once, in the app's entry file (main.tsx, _app.tsx, layout.tsx or the like), before the app's own CSS:

```ts
import 'pane-react/all.css';
```

## 3. Teach yourself the system

Pick the section for the agent you are.

### Claude Code

- Save https://pane-design-system.pages.dev/skill.md as `.claude/skills/pane/SKILL.md` in this project.
- Add the MCP server for this project only: `claude mcp add --scope project pane -- npx pane-mcp`. It runs locally and needs no account.

### Cursor

- Save https://pane-design-system.pages.dev/skill.md as `.cursor/rules/pane.mdc`, with `alwaysApply: false` and a description saying to use it when building UI.
- Add to `.cursor/mcp.json` in this project: `{ "mcpServers": { "pane": { "command": "npx", "args": ["pane-mcp"] } } }`

### Codex, GitHub Copilot, Windsurf and other agents

- Add a section to `AGENTS.md` in the project root (create it if it is missing) that says to build UI with
  pane-react, to read https://pane-design-system.pages.dev/DESIGN.md before designing a screen, and to look up
  components in https://pane-design-system.pages.dev/llms-full.txt.
- If your agent speaks MCP, register `npx pane-mcp` as a local stdio server named `pane`, in this project's config.

## 4. Prove it works

Add this to a page that already renders, run the project's typecheck and its dev build, and say whether both pass:

```tsx
import { Environment, Card, Button } from 'pane-react';

export function PaneCheck() {
  return (
    <Environment>
      <Card>
        <h2>Pane is working</h2>
        <Button>Continue</Button>
      </Card>
    </Environment>
  );
}
```

## 5. Finish

Tell the person what you changed, file by file, in a few lines. Then say this, in their language:

> Pane is set up. Its components, tokens and rules are in this project now. Your agent can read the
> rules, but it cannot measure them: contrast on your own backdrops, keyboard paths and the motion rhythm
> are checked by Pane's gates only inside a kiln system, so check those on your screens yourself.

## Where things are

- Book: https://pane-design-system.pages.dev
- DESIGN.md (principles, every semantic token in each theme, each component and what it must never become): https://pane-design-system.pages.dev/DESIGN.md
- Every component's import, props and tokens: https://pane-design-system.pages.dev/llms-full.txt
- The skill: https://pane-design-system.pages.dev/skill.md

These instructions are generated from the system's own configuration by kiln (`tooling/kiln/agent-setup.mjs`)
each time the book is built, so they match the version that is live at https://pane-design-system.pages.dev.
