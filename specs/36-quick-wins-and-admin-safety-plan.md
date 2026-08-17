# Quick Wins & Admin Safety Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the 6 fixes defined in `specs/35-quick-wins-and-admin-safety-design.md` (A1, A2, A3, A4, A5, D1) as small, independently-committable changes.

**Architecture:** Each item is independent. Tasks are ordered shortest-first so simpler commits land while heavier items (CLI updaters, atomic-write helper) progress. The admin atomic-write logic is extracted to a pure helper (`admin/lib/yaml-storage.ts`) so it can be unit-tested without the HTTP layer.

**Tech Stack:** TypeScript, Next.js 16 App Router, bun (package manager + test runner), commander, js-yaml.

---

## File Structure

**Create:**
- `admin/lib/yaml-storage.ts` — atomic write helper (write tmp → backup original → rename tmp)
- `admin/lib/yaml-storage.test.ts` — unit tests for the helper
- `cli/agent.test.ts` — integration tests for the agent CLI subcommands modified in this plan

**Modify:**
- `app/layout.tsx` — drop two `as any` casts (A2)
- `app/page.tsx` — swap `#000` literal for `#3e3101` (A5)
- `cli/agent.ts` — expand `npc update` and `player update` flag sets (A1)
- `admin/app/api/campaign/route.ts` — call the new atomic write helper (D1)
- `.gitignore` — ignore `data/*.bak` (D1)
- `README.md` — replace boilerplate (A3)
- `admin/README.md` — replace boilerplate (A3)
- `admin/AGENTS.md` — expand beyond the Next.js warning (A4)

---

## Task 1: A2 — Drop stale `as any` in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Verify baseline lint passes**

Run: `bun run lint`
Expected: clean exit (warnings OK, errors fail). If errors exist on `main`, stop and report.

- [ ] **Step 2: Read the current file**

Read `app/layout.tsx`. Confirm lines 15 and 28 contain `(data.home as any).header`.

- [ ] **Step 3: Remove the casts**

In `app/layout.tsx`:

Replace:
```tsx
  const data = getCampaignData();
  const header = (data.home as any).header;
```
with:
```tsx
  const data = getCampaignData();
  const header = data.home.header;
```

Replace:
```tsx
  const data = getCampaignData();
  const navBrand = (data.home as any).header?.navBrand || "Sablewood";
```
with:
```tsx
  const data = getCampaignData();
  const navBrand = data.home.header?.navBrand || "Sablewood";
```

- [ ] **Step 4: Verify lint and typecheck**

Run: `bun run lint`
Expected: clean exit, no new errors.

Run: `bun run build`
Expected: build succeeds (this is the strongest TypeScript check because Next.js runs tsc during build).

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "refactor(layout): drop stale \`as any\` casts on data.home

HomeData.header is already typed as optional in types/index.ts;
the casts were leftover from before the type was tightened."
```

---

## Task 2: A5 — Replace `#000` literal in Quest Board gradient

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read the line in context**

Read `app/page.tsx` around line 110. Confirm the gradient string contains `#000 0, #000 2px`.

- [ ] **Step 2: Swap the hex**

Replace:
```tsx
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)" }}></div>
```
with:
```tsx
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #3e3101 0, #3e3101 2px, transparent 2px, transparent 8px)" }}></div>
```

- [ ] **Step 3: Smoke test**

Run: `bun dev` in the background, open `http://localhost:3000`, confirm the Notice Board section still has visible diagonal stripes. (If no Notice Board renders, the campaign data has no quests/wanted items — note this and continue; the change is independently verifiable.)

Stop `bun dev`.

- [ ] **Step 4: Lint**

Run: `bun run lint`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "style(page): use on-surface token instead of #000 in gradient

DESIGN.md forbids #000000. Swapped the repeating-linear-gradient
stripe color to #3e3101 (the on-surface token value). At 10%
opacity the visual difference is imperceptible."
```

---

## Task 3: D1a — Extract atomic write helper

**Files:**
- Create: `admin/lib/yaml-storage.ts`
- Create: `admin/lib/yaml-storage.test.ts`

- [ ] **Step 1: Write the failing test file**

Create `admin/lib/yaml-storage.test.ts`:

```ts
import { expect, test, afterEach, beforeEach } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { writeYamlAtomic } from "./yaml-storage";

let tmpDir: string;
let targetPath: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yaml-storage-"));
  targetPath = path.join(tmpDir, "campaign.yml");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test("writes new file when target does not exist", () => {
  writeYamlAtomic(targetPath, "hello: world\n");
  expect(fs.readFileSync(targetPath, "utf8")).toBe("hello: world\n");
  expect(fs.existsSync(targetPath + ".bak")).toBe(false);
  expect(fs.existsSync(targetPath + ".tmp")).toBe(false);
});

test("creates .bak of previous content before overwriting", () => {
  fs.writeFileSync(targetPath, "original: true\n");
  writeYamlAtomic(targetPath, "updated: true\n");

  expect(fs.readFileSync(targetPath, "utf8")).toBe("updated: true\n");
  expect(fs.readFileSync(targetPath + ".bak", "utf8")).toBe("original: true\n");
  expect(fs.existsSync(targetPath + ".tmp")).toBe(false);
});

test("leaves original file intact if write fails", () => {
  fs.writeFileSync(targetPath, "original: true\n");

  // Force a write failure by making tmpDir read-only after the original is in place
  const badTarget = path.join(tmpDir, "subdir-does-not-exist", "campaign.yml");
  expect(() => writeYamlAtomic(badTarget, "updated: true\n")).toThrow();

  // Original target still intact
  expect(fs.readFileSync(targetPath, "utf8")).toBe("original: true\n");
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `bun test admin/lib/yaml-storage.test.ts`
Expected: fails with "Cannot find module './yaml-storage'" (or similar import error).

- [ ] **Step 3: Implement the helper**

Create `admin/lib/yaml-storage.ts`:

```ts
import fs from "fs";

/**
 * Atomically write `content` to `filePath`. If the file already exists, the
 * previous contents are first copied to `<filePath>.bak`. The new content is
 * written to `<filePath>.tmp` and then renamed over `filePath`, which is
 * atomic on POSIX. On any error, the original file is left untouched.
 */
export function writeYamlAtomic(filePath: string, content: string): void {
  const tmpPath = `${filePath}.tmp`;
  const bakPath = `${filePath}.bak`;

  fs.writeFileSync(tmpPath, content, "utf8");

  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, bakPath);
    }
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Clean up the tmp file if it's still hanging around
    try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
    throw err;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun test admin/lib/yaml-storage.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add admin/lib/yaml-storage.ts admin/lib/yaml-storage.test.ts
git commit -m "feat(admin): add writeYamlAtomic helper with .bak backup

Writes to <path>.tmp then renames over the target (atomic on POSIX)
and copies the previous file to <path>.bak first. Caller gets the
same backup behavior the CLI already provides via cli/data.ts."
```

---

## Task 4: D1b — Wire the helper into the admin API route

**Files:**
- Modify: `admin/app/api/campaign/route.ts`

- [ ] **Step 1: Read the current file**

Read `admin/app/api/campaign/route.ts`. Confirm the PUT handler currently uses `fs.writeFileSync` directly.

- [ ] **Step 2: Replace the write**

Replace the file contents with:

```ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { writeYamlAtomic } from '../../../lib/yaml-storage';

// Path relative to the admin app directory (admin/ -> ../data/campaign.yml)
const getCampaignFilePath = () => path.join(process.cwd(), '../data/campaign.yml');

export async function GET() {
  try {
    const filePath = getCampaignFilePath();
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading campaign.yml:', error);
    return NextResponse.json({ error: 'Failed to read campaign data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json();
    const filePath = getCampaignFilePath();

    // Convert back to YAML, preserving block styles for multiline strings
    const newYamlContent = yaml.dump(updatedData, {
      lineWidth: -1, // Don't wrap long lines
      noRefs: true,
    });

    writeYamlAtomic(filePath, newYamlContent);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing campaign.yml:', error);
    return NextResponse.json({ error: 'Failed to save campaign data' }, { status: 500 });
  }
}
```

(Existing admin code uses relative imports rather than the `@/` alias even though the alias is configured — matching the convention.)

- [ ] **Step 3: Verify admin lint passes**

Run: `bun --cwd admin run lint`
Expected: clean.

- [ ] **Step 4: Verify admin builds**

Run: `bun --cwd admin run build`
Expected: build succeeds.

- [ ] **Step 5: Smoke test the API**

Start admin: `bun run dev:admin` (port 3001, runs in background).

In another shell:
```bash
curl -s http://localhost:3001/api/campaign | head -c 200
```
Expected: JSON starting with `{"home":...`.

```bash
curl -s http://localhost:3001/api/campaign > /tmp/campaign.json
curl -s -X PUT -H "Content-Type: application/json" --data @/tmp/campaign.json http://localhost:3001/api/campaign
```
Expected: `{"success":true}` AND `data/campaign.yml.bak` now exists at the repo root AND `data/campaign.yml.tmp` does NOT exist.

Verify with:
```bash
ls data/campaign.yml*
```
Expected output includes `data/campaign.yml` and `data/campaign.yml.bak`, no `.tmp`.

Stop the admin dev server.

- [ ] **Step 6: Commit**

```bash
git add admin/app/api/campaign/route.ts
git commit -m "fix(admin): use atomic write for campaign.yml PUT

Replaces the non-atomic fs.writeFileSync with writeYamlAtomic,
which writes to .tmp, backs up the existing file to .bak, then
renames. A crash or interrupt mid-write no longer corrupts the
canonical campaign.yml."
```

---

## Task 5: D1c — Ignore `.bak` files

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Confirm `.bak` is not already ignored**

Run: `grep -E '\\bbak\\b|\\*\\.bak' .gitignore`
Expected: no output. (If matched, skip this task entirely.)

- [ ] **Step 2: Append the rule**

Append to `.gitignore`:

```
# campaign data backups (written by cli/data.ts and admin/lib/yaml-storage.ts)
data/*.bak
data/*.tmp
```

- [ ] **Step 3: Verify a stray .bak is ignored**

```bash
touch data/test.bak
git status --short data/
```
Expected: `data/test.bak` does NOT appear in the output.

```bash
rm data/test.bak
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore data/*.bak and data/*.tmp

The CLI write helper and the admin atomic-write helper both
produce these alongside campaign.yml; they should not be tracked."
```

---

## Task 6: A1a — Expand `npc update` flags

**Files:**
- Create: `cli/agent.test.ts`
- Modify: `cli/agent.ts`

- [ ] **Step 1: Write the failing test**

Create `cli/agent.test.ts`:

```ts
import { expect, test, beforeEach, afterAll } from "bun:test";
import { spawnSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

// Tests run the agent CLI as a subprocess against a temp campaign file.
// We use a temporary cwd so CAMPAIGN_FILE (which is process.cwd() + data/campaign.yml)
// points into our fixture.

const REPO_ROOT = path.resolve(__dirname, "..");

async function setupFixture(seed: object): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(REPO_ROOT, ".agent-test-"));
  await fs.mkdir(path.join(tmpDir, "data"));
  await fs.writeFile(
    path.join(tmpDir, "data", "campaign.yml"),
    yaml.dump(seed),
    "utf8",
  );
  return tmpDir;
}

async function cleanupFixture(tmpDir: string): Promise<void> {
  await fs.rm(tmpDir, { recursive: true, force: true });
}

function runAgent(cwd: string, args: string[]) {
  return spawnSync("bun", ["run", path.join(REPO_ROOT, "cli/agent.ts"), ...args], {
    cwd,
    encoding: "utf8",
  });
}

const baseCampaign = {
  home: {
    header: { title: "T", description: "D", navBrand: "N" },
  },
  locations: [],
  timeline: { title: "T", subtitle: "S", description: "D", events: [] },
  players: [],
  npcs: [
    { id: "elder", name: "Elder Maeve", role: "elder", location: "hush", description: "wise" },
  ],
};

let fixture: string;

beforeEach(async () => {
  fixture = await setupFixture(baseCampaign);
});

afterAll(async () => {
  // Best-effort cleanup of any stragglers
  const entries = await fs.readdir(REPO_ROOT);
  for (const e of entries) {
    if (e.startsWith(".agent-test-")) {
      await fs.rm(path.join(REPO_ROOT, e), { recursive: true, force: true }).catch(() => {});
    }
  }
});

test("npc update accepts --image and --attitudeTowardParty", async () => {
  const result = runAgent(fixture, [
    "npc", "update", "elder",
    "--image", "/images/elder.webp",
    "--attitudeTowardParty", "friendly",
  ]);
  expect(result.status).toBe(0);

  const written = yaml.load(
    await fs.readFile(path.join(fixture, "data/campaign.yml"), "utf8"),
  ) as typeof baseCampaign;
  const elder = written.npcs.find((n) => n.id === "elder") as any;
  expect(elder.image).toBe("/images/elder.webp");
  expect(elder.attitudeTowardParty).toBe("friendly");
  // Existing fields preserved
  expect(elder.role).toBe("elder");

  await cleanupFixture(fixture);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test cli/agent.test.ts`
Expected: test fails with commander reporting `error: unknown option '--image'` (visible in `result.stderr`).

- [ ] **Step 3: Add the flags to `npc update`**

In `cli/agent.ts`, locate the `npc.command("update")` block (around line 66) and add the new options. Replace:

```ts
npc.command("update")
  .argument("<id>", "NPC ID")
  .option("--name <string>")
  .option("--role <string>")
  .option("--location <string>")
  .option("--description <string>")
  .action(async (id, options) => {
```

with:

```ts
npc.command("update")
  .argument("<id>", "NPC ID")
  .option("--name <string>")
  .option("--role <string>")
  .option("--location <string>")
  .option("--description <string>")
  .option("--image <string>")
  .option("--attitudeTowardParty <string>")
  .action(async (id, options) => {
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun test cli/agent.test.ts`
Expected: test passes.

- [ ] **Step 5: Commit**

```bash
git add cli/agent.ts cli/agent.test.ts
git commit -m "feat(agent): allow updating npc image and attitudeTowardParty

These fields are part of the NPC type but were missing from the
agent CLI updater, forcing manual YAML edits."
```

---

## Task 7: A1b — Expand `player update` flags

**Files:**
- Modify: `cli/agent.ts`
- Modify: `cli/agent.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `cli/agent.test.ts`:

```ts
test("player update accepts all scalar player fields", async () => {
  // Add a player to the fixture first
  const seed = {
    ...baseCampaign,
    players: [
      {
        id: "orna",
        name: "Orna Kaan",
        class: "Sorcerer",
        level: 1,
        ancestry: "",
        community: "",
        subclass: "",
        tier: 1,
        image: "",
        description: "",
        backstory: "",
        stats: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0 },
        backgroundQuestions: [],
        connectionQuestions: [],
      },
    ],
  };
  const localFixture = await setupFixture(seed);

  const result = runAgent(localFixture, [
    "player", "update", "orna",
    "--ancestry", "Galapa",
    "--community", "Loreborn",
    "--subclass", "Primal Origin",
    "--tier", "2",
    "--image", "/images/orna.webp",
    "--description", "A wise sorcerer.",
    "--backstory", "She was raised by turtles.",
  ]);
  expect(result.status).toBe(0);

  const written = yaml.load(
    await fs.readFile(path.join(localFixture, "data/campaign.yml"), "utf8"),
  ) as typeof seed;
  const orna = written.players.find((p) => p.id === "orna") as any;
  expect(orna.ancestry).toBe("Galapa");
  expect(orna.community).toBe("Loreborn");
  expect(orna.subclass).toBe("Primal Origin");
  expect(orna.tier).toBe(2);
  expect(orna.image).toBe("/images/orna.webp");
  expect(orna.description).toBe("A wise sorcerer.");
  expect(orna.backstory).toBe("She was raised by turtles.");
  // Existing fields preserved
  expect(orna.name).toBe("Orna Kaan");
  expect(orna.class).toBe("Sorcerer");

  await cleanupFixture(localFixture);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test cli/agent.test.ts`
Expected: previous test still passes; new test fails with `error: unknown option '--ancestry'`.

- [ ] **Step 3: Expand the player update flags**

In `cli/agent.ts`, locate the `player.command("update")` block (around line 294). Replace:

```ts
player.command("update")
  .argument("<id>", "Player ID")
  .option("--name <string>")
  .option("--class <string>")
  .option("--level <number>", "Player Level", parseInt)
  .action(async (id, options) => {
```

with:

```ts
player.command("update")
  .argument("<id>", "Player ID")
  .option("--name <string>")
  .option("--class <string>")
  .option("--level <number>", "Player Level", parseInt)
  .option("--ancestry <string>")
  .option("--community <string>")
  .option("--subclass <string>")
  .option("--tier <number>", "Player Tier", parseInt)
  .option("--image <string>")
  .option("--description <string>")
  .option("--backstory <string>")
  .action(async (id, options) => {
```

- [ ] **Step 4: Run the tests to verify both pass**

Run: `bun test cli/agent.test.ts`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add cli/agent.ts cli/agent.test.ts
git commit -m "feat(agent): allow updating player ancestry/community/subclass/tier/image/description/backstory

\`player add\` creates rows with default empty values for image,
description, and backstory; this lets the agent CLI fill them in
without manual YAML edits."
```

---

## Task 8: A3a — Real root README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the file**

Overwrite `README.md` with:

```markdown
# Sablewood Chronicles

A living chronicle for a Daggerheart campaign. A statically-rendered Next.js site
backed by a single YAML file (`data/campaign.yml`) that contains players, NPCs,
locations, and timeline events.

## Quick start

```bash
bun install
bun dev                  # public site on http://localhost:3000
```

## The three surfaces

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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: replace create-next-app boilerplate README"
```

---

## Task 9: A3b — Real admin README

**Files:**
- Modify: `admin/README.md`

- [ ] **Step 1: Replace the file**

Overwrite `admin/README.md` with:

```markdown
# Sablewood Chronicles — Admin

Local-only Next.js app for editing the campaign YAML through a form UI.
Reads and writes `../data/campaign.yml` directly from disk via an internal
API route (`app/api/campaign/route.ts`).

## Run

From the repo root:

```bash
bun run dev:admin        # http://localhost:3001
```

Or from this directory:

```bash
bun dev
```

## What it does

- `GET /api/campaign` returns the parsed YAML as JSON.
- `PUT /api/campaign` accepts JSON and writes it back to `../data/campaign.yml`
  using `lib/yaml-storage.ts` (atomic rename + `.bak` of the previous version).
- The `AutoForm` component renders editable fields from the entity schemas in
  `lib/schemas/`.

## Not for production

There is no auth on the API route — it writes to the dev machine's filesystem.
This app exists to make local content edits faster than hand-editing YAML.
Never expose it to the internet.

## Rules

See `../AGENTS.md` (bun-only tooling, `DESIGN.md` constraints) and `./AGENTS.md`
for admin-specific notes.
```

- [ ] **Step 2: Commit**

```bash
git add admin/README.md
git commit -m "docs(admin): replace create-next-app boilerplate README"
```

---

## Task 10: A4 — Expand `admin/AGENTS.md`

**Files:**
- Modify: `admin/AGENTS.md`

- [ ] **Step 1: Replace the file**

Overwrite `admin/AGENTS.md` with:

```markdown
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Admin app notes

This is a separate Next.js app (port 3001) in the same monorepo as the public
site. It exists to edit `../data/campaign.yml` through a form UI and is
intended for local-only use — there is no auth.

## Workflow rules (inherit from root, plus these)

- All root rules in `../AGENTS.md` apply (bun-only tooling, `DESIGN.md`
  constraints, `specs/XX-*.md` for new features).
- This app currently uses hard-coded hex values in `app/globals.css` and
  inline classes (e.g. `bg-[#fff8f0]`). When you add NEW UI, prefer the same
  CSS-custom-property token approach used in the root app (`../app/globals.css`)
  rather than expanding the hard-coded set.

## File map

- `app/api/campaign/route.ts` — GET/PUT handlers against `../data/campaign.yml`.
  Writes go through `lib/yaml-storage.ts` for atomic-rename + `.bak`.
- `lib/schemas/` — entity schemas (Location, NPC, Player, etc.) that drive `AutoForm`.
- `lib/schema.ts` — the `FieldSchema` union the AutoForm walks.
- `lib/utils.ts` — `cleanData()` strips empty optional fields before writing.
- `components/AutoForm.tsx` — generic form renderer over `EntitySchema`.
```

- [ ] **Step 2: Commit**

```bash
git add admin/AGENTS.md
git commit -m "docs(admin): expand AGENTS.md beyond the Next.js warning"
```

---

## Final verification

- [ ] **Step 1: Full lint pass**

Run: `bun run lint && bun --cwd admin run lint`
Expected: both clean.

- [ ] **Step 2: Full build pass**

Run: `bun run build && bun --cwd admin run build`
Expected: both succeed.

- [ ] **Step 3: Full test pass**

Run: `bun test`
Expected: all tests pass (the existing `cli/data.test.ts` plus the new `cli/agent.test.ts` and `admin/lib/yaml-storage.test.ts`).

- [ ] **Step 4: Quick visual check**

Run: `bun dev`, open `http://localhost:3000`, confirm home page renders and Notice Board stripes are visible. Stop dev server.

- [ ] **Step 5: Confirm git is clean**

Run: `git status`
Expected: clean working tree, all commits already made by individual tasks.
