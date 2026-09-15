# Update GitHub Actions Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize `.github/workflows/nextjs.yml` by updating Node.js to version 22, integrating `oven-sh/setup-bun@v2` to use `bun` as the native package runner on CI (matching project conventions), and adding automated lint and test verification steps before deployment.

**Architecture:** Replace the legacy npm/yarn detection logic in `.github/workflows/nextjs.yml` with `oven-sh/setup-bun@v2` and `actions/setup-node@v4` (Node 22 LTS). Use `bun install --frozen-lockfile`, run `bun run lint` and `bun test`, and build the static output with `bun run build`.

**Tech Stack:** GitHub Actions, Bun (`oven-sh/setup-bun@v2`), Node.js 22 LTS, Next.js 16.3.5.

---

### Task 1: Update `.github/workflows/nextjs.yml`

**Files:**
- Modify: `.github/workflows/nextjs.yml`

- [ ] **Step 1: Edit `.github/workflows/nextjs.yml`**
  Update the workflow definition:
  - Add `oven-sh/setup-bun@v2`
  - Update `actions/setup-node@v4` to `node-version: "22"`
  - Replace `detect-package-manager` and `npm ci` with `bun install --frozen-lockfile`
  - Add `Run linter` (`bun run lint`)
  - Add `Run tests` (`bun test`)
  - Run build via `bun run build`
  - Retain `actions/configure-pages@v5`, Next.js cache, and `actions/upload-pages-artifact@v3` (`path: ./out`)

---

### Task 2: Verification

**Files:**
- Test / Verify: Workflow syntax validation and local build/test consistency

- [ ] **Step 1: Validate YAML syntax of the workflow**
  Ensure `.github/workflows/nextjs.yml` parses without YAML or structure errors.

- [ ] **Step 2: Run local test, lint, and build**
  Run:
  ```bash
  bun run lint && bun test && bun run build
  ```
  Expected output: All 11 tests pass, 0 lint errors, static build generated in `./out`.
