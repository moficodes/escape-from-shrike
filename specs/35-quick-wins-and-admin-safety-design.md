# Quick Wins & Admin Safety — Design

**Status:** Design
**Scope:** 6 independent, low-risk improvements identified during a code audit (Batches "A" + "D"). No architectural changes, no visual changes to the public site. Each item is mergeable on its own and reversible.

---

## Goal

Address concrete defects and stale code found during an audit pass, without expanding into the larger schema-unification or design-system-cleanup work (deferred to future specs).

## Non-Goals

- **No Zod schema tightening** — `cli/schema.ts` continues to use `z.array(z.any())`. Replacing it requires touching all four parallel definitions (types/index.ts, admin/lib/schemas, cli/schema.ts, cli/agent.ts) and is its own spec.
- **No Notice Board redesign** — the hard-coded hex palette in `app/page.tsx:108-145` violates DESIGN.md but the fix is a visual judgment call, not a mechanical one. Deferred.
- **No request-body validation in the admin API** — only worthwhile once Zod is the source of truth for the campaign shape (above).
- **No `<img>` → `next/image` migration** — `output: "export"` disables Next image optimization, so there is no win.

## Items

### A1 — Expand agent CLI updaters

**Files:** `cli/agent.ts`

`player update` (line 294) currently accepts `--name`, `--class`, `--level`. Add `--ancestry`, `--community`, `--subclass`, `--tier`, `--image`, `--description`, `--backstory`. Rationale: `player add` sets `image`/`description`/`backstory` to defaults, so these can only be filled in after creation — but the agent CLI currently has no way to do that, forcing manual YAML edits.

`npc update` (line 66) accepts `--name`, `--role`, `--location`, `--description`. Add `--image`, `--attitudeTowardParty`.

Stats and Q&A arrays are out of scope — those are structured and belong in the TUI.

### A2 — Drop stale `as any` casts

**Files:** `app/layout.tsx`

Lines 15 and 28 cast `data.home as any` to access `.header`. `HomeData.header` is already optional in `types/index.ts:115`. Remove the casts; the field access is type-safe as-is.

### A3 — Real READMEs

**Files:** `README.md`, `admin/README.md`

Both are unmodified `create-next-app` boilerplate. Rewrite each to describe:
- What the project is (a campaign chronicle site backed by a single YAML)
- The three consumers (public site / admin / CLI) and how to run each
- Pointers to `AGENTS.md` for rules and `DESIGN.md` for visual constraints
- No long architecture write-up — `CLAUDE.md` has that already.

Target: ~30 lines each.

### A4 — Expand `admin/AGENTS.md`

**Files:** `admin/AGENTS.md`

Currently 3 lines (just the Next.js warning). Add:
- Reads/writes `../data/campaign.yml` via `app/api/campaign/route.ts`
- Runs on port 3001, intended for local-only use (no auth)
- Honor DESIGN.md when adding UI; admin currently uses hard-coded hex but new UI should use the same token approach as the root app
- Schema definitions live in `lib/schemas/campaign.ts` and drive the `AutoForm` component

### A5 — Replace `#000` literal in Quest Board gradient

**Files:** `app/page.tsx`

Line 110 — `repeating-linear-gradient(45deg, #000 0, #000 2px, ...)`. DESIGN.md §6 forbids `#000000`. Swap to `#3e3101` (the `on-surface` token value). The gradient is at 10% opacity so the visual difference is imperceptible.

### D1 — Atomic write + backup for admin API

**Files:** `admin/app/api/campaign/route.ts`

Current PUT handler:
```ts
fs.writeFileSync(filePath, newYamlContent, 'utf8');
```
This is non-atomic — a process death or full disk mid-write leaves a truncated `campaign.yml`, breaking the public site. The CLI (`cli/data.ts`) already backs up to `.bak` before writing; the admin API does neither.

New behavior:
1. If `campaign.yml` exists, copy it to `campaign.yml.bak` (matches CLI behavior).
2. Write the new content to `campaign.yml.tmp`.
3. `fs.renameSync` the tmp file over `campaign.yml` (atomic on POSIX).
4. On any error during steps 2–3, leave the original file untouched and return 500.

No new validation of the request body shape — that's deferred to the schema-unification spec.

## Testing

- **A1:** Extend `cli/data.test.ts` (or add a sibling test) to roundtrip a campaign through `player update` for one of the newly added fields. Verifies the new options reach the YAML.
- **A2, A3, A4, A5:** `bun run lint` for type/lint correctness; `bun dev` smoke test that the home page still renders.
- **D1:** A test in admin (or a sibling file under `admin/lib/`) that exercises the helper extracted from the route handler: write, assert `.bak` exists, assert no `.tmp` left behind, assert main file matches new content. Don't test the HTTP layer — test the file-writing helper.

## Risks

- **A1** changes CLI surface area but is additive (new flags), so no script breakage.
- **D1** adds a `.bak` file next to `data/campaign.yml`. The current `.gitignore` does not cover it; add `data/*.bak` as part of this change.
- **A3/A4** are doc-only.
- **A2/A5** are mechanical.

No risks to the public site rendering.

## Out of scope (recap)

Tracked separately for future specs:
- **Batch B:** Notice Board → design token migration (`app/page.tsx:108-145`, `app/components/player-list.tsx:35-41`).
- **Batch C:** Zod-as-source-of-truth schema unification across types/index.ts, admin/lib/schemas, cli/schema.ts, cli/agent.ts.
