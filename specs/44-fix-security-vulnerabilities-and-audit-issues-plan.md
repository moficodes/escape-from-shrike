# Fix Security Vulnerabilities and Audit Issues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all vulnerabilities reported by `npm audit` (including Next.js critical CVEs, js-yaml DoS, PostCSS XSS/path traversal, sharp, browserslist, ws, and related dependencies) across root and admin workspaces while ensuring no build, test, or lint regressions.

**Architecture:** Upgrade direct dependencies (`next`, `eslint-config-next`, `js-yaml`) in both root `package.json` and `admin/package.json` to secure release versions, run dependency resolution to update transitive dependencies, and synchronize `bun.lock` and `package-lock.json`. Thoroughly verify that both the root application, CLI tools, and admin application build, test, and lint cleanly without breaking changes.

**Tech Stack:** Next.js 16.3.5, React 19, TypeScript, Bun, ESLint 9, npm/bun lockfiles.

---

### Task 1: Update Direct Dependencies in `package.json` and `admin/package.json`

**Files:**
- Modify: `package.json`
- Modify: `admin/package.json`

- [ ] **Step 1: Update root `package.json`**
  - Update `next` from `16.2.3` to `^16.3.5`
  - Update `eslint-config-next` from `16.2.3` to `^16.3.5`
  - Update `js-yaml` from `^4.1.1` to `^4.3.2`

- [ ] **Step 2: Update `admin/package.json`**
  - Update `next` from `16.2.3` to `^16.3.5`
  - Update `eslint-config-next` from `^16.2.3` to `^16.3.5`
  - Update `js-yaml` from `^4.1.1` to `^4.3.2`

---

### Task 2: Install and Resolve Transitive Vulnerabilities

**Files:**
- Modify: `bun.lock`
- Modify: `package-lock.json`

- [ ] **Step 1: Run dependency updates with bun and audit fix**
  Run:
  ```bash
  bun install && npm audit fix
  ```
  Expected output: Updated lockfiles with patched versions of `nanoid`, `ws`, `postcss`, `browserslist`, `brace-expansion`, and `@babel/core`.

- [ ] **Step 2: Resync `bun.lock`**
  Run:
  ```bash
  bun install
  ```
  Expected output: Lockfile synchronized and all dependencies installed cleanly.

---

### Task 3: Verification & Security Audit Check

**Files:**
- Test / Verify: All tests, lints, and builds across root and admin apps

- [ ] **Step 1: Verify `npm audit` reports 0 vulnerabilities**
  Run:
  ```bash
  npm audit
  ```
  Expected output: `found 0 vulnerabilities` (or zero moderate/high/critical).

- [ ] **Step 2: Run test suite**
  Run:
  ```bash
  bun test
  ```
  Expected output: 11 passed tests, 0 failures.

- [ ] **Step 3: Run root linter and production build**
  Run:
  ```bash
  bun run lint && bun run build
  ```
  Expected output: 0 errors; clean Next.js 16.3.5 production build generating all 26 static pages.

- [ ] **Step 4: Run admin app linter and production build**
  Run:
  ```bash
  bun run --cwd admin lint && bun run --cwd admin build
  ```
  Expected output: 0 errors; clean production build for the admin app.
