# Sablewood Chronicles

A living chronicle for a Daggerheart campaign. A statically-rendered Next.js site
backed by a single YAML file (`data/campaign.yml`) that contains players, NPCs,
locations, and timeline events.

## Quick start

```bash
bun install
bun dev                  # public site on http://localhost:3000
```

## The four surfaces

| Surface          | Path         | What it does                                                    | Run                           |
| ---------------- | ------------ | --------------------------------------------------------------- | ----------------------------- |
| Public site      | `app/`       | Read-only Next.js site, statically exported to GitHub Pages.    | `bun dev`                     |
| Admin app        | `admin/`     | Local-only Next.js app for editing `campaign.yml` via a form UI. | `bun run dev:admin` (:3001)   |
| Interactive TUI  | `cli/`       | Terminal UI (ink) for editing the same YAML.                    | `bun run cli/index.tsx`       |
| Agent CLI        | `cli/agent.ts` | Non-interactive CLI for scripted edits.                        | `bun run agent --help`        |

All four read/write the same `data/campaign.yml`. The CLI and admin app create
a `.bak` next to the file before overwriting; the public site is read-only.

## Tests

```bash
bun test                 # everything
bun test cli/data.test.ts
```

## Rules for contributors (including AI coding agents)

- Bun is the only supported package manager. See `AGENTS.md`.
- UI work must follow `DESIGN.md` (no 1px borders, no `#000`, no sharp corners).
- New features start with a plan doc in `specs/XX-*.md`.
- Architecture overview for AI agents lives in `CLAUDE.md`.

## Deployment

`main` is built and deployed to GitHub Pages by `.github/workflows/nextjs.yml`
(uses `npm ci` because the GitHub Pages action expects a npm lockfile, so
`package-lock.json` is committed alongside `bun.lock`).
