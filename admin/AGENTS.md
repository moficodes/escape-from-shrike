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
