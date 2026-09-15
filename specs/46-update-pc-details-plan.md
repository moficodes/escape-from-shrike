# Update Player Characters Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update PC ancestry, community, and subclass fields in `data/campaign.yml` using the agent CLI to reflect new character sheet information for Flora, Fire Patch, Loki Morgulis, Maleficent, and Moriarty, and harmonize timeline descriptions.

**Architecture:** Use `bun run agent player update` to modify character fields in `data/campaign.yml`, and `bun run agent event update` for timeline event texts mentioning ancestry. Verify with `bun test` and `bun run build`.

**Tech Stack:** Next.js 16.3.5, React 19, TypeScript, Bun, Commander CLI (`cli/agent.ts`), YAML (`data/campaign.yml`).

---

### Task 1: Update Player Characters via Agent CLI

**Files:**
- Modify: `data/campaign.yml` via `bun run agent player update`

- [ ] **Step 1: Update Flora**
  Run:
  ```bash
  bun run agent player update "flora" --ancestry "Aetheris" --community "Freeborne" --subclass "Poisoners Guild" --description "An Aetheris assassin burdened with lethal expertise from the mortal realm."
  ```

- [ ] **Step 2: Update Fire Patch**
  Run:
  ```bash
  bun run agent player update "fire-patch" --ancestry "Firebug" --community "Seaborn" --subclass "Wayfinder"
  ```

- [ ] **Step 3: Update Loki Morgulis**
  Run:
  ```bash
  bun run agent player update "loki-morgulis" --community "Highborn" --subclass "School of War"
  ```

- [ ] **Step 4: Update Maleficent**
  Run:
  ```bash
  bun run agent player update "maleficent" --subclass "Nightwalker"
  ```

- [ ] **Step 5: Update Moriarty**
  Run:
  ```bash
  bun run agent player update "moriarty" --community "Richborn" --subclass "Primal Origin"
  ```

---

### Task 2: Harmonize Timeline Events with Updated Ancestries

**Files:**
- Modify: `data/campaign.yml` via `bun run agent event update`

- [ ] **Step 1: Update Fire Patch arrival event**
  Run:
  ```bash
  bun run agent event update "evt-arrival-fire-patch" --description "Four hundred and eighty years after Loki (20 years ago), Fire Patch, a Firebug ranger, receives the redemption offer from the Man in the Green Cloak at the moment of his death and awakens in Shrike."
  ```

- [ ] **Step 2: Update Flora arrival event**
  Run:
  ```bash
  bun run agent event update "evt-arrival-flora" --description "Two years ago, Flora, an Aetheris assassin, is granted a chance at redemption by the Man in the Green Cloak and sent to Shrike."
  ```

---

### Task 3: Verification

**Files:**
- Test / Verify: `data/campaign.yml`, test suite, production build

- [ ] **Step 1: Verify data via Agent CLI**
  Run:
  ```bash
  bun run agent player list
  ```

- [ ] **Step 2: Run test suite**
  Run:
  ```bash
  bun test
  ```
  Expected: 11 pass, 0 fail.

- [ ] **Step 3: Run production build**
  Run:
  ```bash
  bun run build
  ```
  Expected: Clean build and static HTML generation for all routes.
