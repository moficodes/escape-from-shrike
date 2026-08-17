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
