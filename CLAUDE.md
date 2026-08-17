@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The `@AGENTS.md` import above carries the load-bearing rules: bun-only tooling, the Next.js-has-breaking-changes warning, the `DESIGN.md` constraints, and the `specs/XX-*.md` planning workflow. Read it before any code change. The notes below cover commands and architecture not in AGENTS.md.

## Commands

This is a bun workspace with two apps (root + `admin/`).

```bash
# Main public site (Next.js, port 3000)
bun dev
bun run build          # static export to ./out (next.config.ts: output: "export")
bun run lint

# Admin app (Next.js, port 3001) — runs in the admin/ workspace
bun run dev:admin
bun --cwd admin run build
bun --cwd admin run lint

# Interactive TUI for editing data/campaign.yml (ink-based)
bun run cli/index.tsx

# Non-interactive CLI for scripted/automated edits (commander-based)
bun run agent <subcommand> ...   # e.g. bun run agent player add --id ... --name ...
bun run agent --help             # subcommands: home, npc, location, event, player, quest

# Tests (bun's built-in test runner; files live next to source as *.test.ts)
bun test                         # all tests
bun test cli/data.test.ts        # single file
bun test --watch
```

The GitHub Pages workflow (`.github/workflows/nextjs.yml`) ignores `bun.lock` and runs `npm ci && next build`, so `package-lock.json` is committed and must stay in sync with `package.json`.

## Architecture

### One YAML, three consumers

`data/campaign.yml` is the single source of truth for the entire project — players, NPCs, locations, timeline events, home page config. Three different surfaces read or write it:

1. **Public site (`app/`, `lib/`, `types/`)** — Next.js App Router site, **read-only** consumer. `lib/data.ts#getCampaignData()` reads the YAML at build time (cached in production) and returns a `CampaignData` typed via `types/index.ts`. Because `next.config.ts` sets `output: "export"`, every dynamic route (`app/players/[id]`, `app/locations/[id]`, `app/npcs/[id]`) must export `generateStaticParams` so it can be prerendered to static HTML for GitHub Pages.
2. **Admin app (`admin/`)** — separate Next.js app at port 3001, **read/write**. The `AutoForm` component renders fields from `admin/lib/schemas/campaign.ts` (a hand-maintained schema describing the YAML shape), and `admin/app/api/campaign/route.ts` provides `GET`/`PUT` against the YAML file at `../data/campaign.yml`. Only meant to run locally — it touches the filesystem of the dev machine.
3. **CLI (`cli/`)** — two separate entry points sharing `cli/data.ts` (read/write with a `.bak` backup) and `cli/schema.ts` (Zod):
   - `cli/index.tsx` — interactive TUI (ink + ink-text-input/ink-select-input). Uses alternate-screen buffer; cleans up on SIGINT/SIGTERM.
   - `cli/agent.ts` — non-interactive `commander` CLI exposed as `bun run agent`, designed for scripted/agent-driven edits.

When you change the shape of `data/campaign.yml`, you typically need to update **all four** of: `types/index.ts` (site types), `admin/lib/schemas/campaign.ts` (admin AutoForm), `cli/schema.ts` (Zod validation), and any new fields in `cli/agent.ts` flags. The current Zod schema treats `locations`/`players`/`npcs`/`events` as `z.array(z.any())` — strictness lives in the TS types and the admin schema, not in runtime validation.

### Design tokens live in CSS

The DESIGN.md palette is wired up as CSS custom properties in `app/globals.css` (`--surface`, `--primary`, `--on-surface`, etc.) with a `.dark` variant. Tailwind v4 (`@tailwindcss/postcss`) picks these up so utilities like `bg-surface`, `text-on-surface`, `bg-primary-container` work directly. The admin app has its own `admin/app/globals.css` with hard-coded hex values — it deliberately does not share the token system.

### Path alias

`tsconfig.json` maps `@/*` → repo root, so `@/lib/data`, `@/types`, `@/app/components/...` all resolve from the project root. `admin/` is excluded from the root tsconfig and has its own.

### Specs as the source of design intent

`specs/XX-*.md` are numbered plan documents (currently up to 34). Per AGENTS.md, new work must add a new plan doc with the next number before code is written. The plans are written for execution by the superpowers `subagent-driven-development` / `executing-plans` skills and use `- [ ]` checkboxes for step tracking.
