# Spec 38: Generic Campaign Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Sablewood Chronicles into a generic, parameter-driven template for any tabletop RPG campaign, allowing easy cloning, configuration of colors, fonts, backgrounds, custom calendars, and rules systems (Daggerheart, D&D 5e, Pathfinder 2e, or generic).

**Architecture:** 
1. Unify all schemas under a modular `lib/systems/` directory.
2. Read system & theme settings dynamically from `data/campaign.yml` at build/runtime.
3. Inject Tailwind CSS variables via an HTML inline style tag in `app/layout.tsx`.
4. Create an interactive scaffolding CLI tool (`cli/init-campaign.ts`) to easily instantiate new guides.

**Tech Stack:** TypeScript, Next.js (App Router, static export), Tailwind CSS v4, Ink/Commander.

---

## File Structure & Dependencies

We will modify or create the following files:
- **Create**: `lib/systems/index.ts` — Game system registry
- **Create**: `lib/systems/daggerheart.ts` — Daggerheart system rules
- **Create**: `lib/systems/dnd5e.ts` — D&D 5e system rules
- **Create**: `lib/systems/pathfinder2e.ts` — Pathfinder 2e system rules
- **Create**: `lib/systems/generic.ts` — Generic key-value fallback system
- **Modify**: `lib/data.ts` — Read settings and backgrounds from yaml
- **Modify**: `app/layout.tsx` — Dynamic CSS variables injection, theme presets & custom fonts loading
- **Modify**: `types/index.ts` — Add configuration and setting typings
- **Create**: `cli/init-campaign.ts` — Interactive CLI setup wizard
- **Modify**: `package.json` — Add setup script

---

## Implementation Tasks

### Task 1: Create Game System Presets Registry

**Files:**
- Create: `lib/systems/index.ts`
- Create: `lib/systems/daggerheart.ts`
- Create: `lib/systems/dnd5e.ts`
- Create: `lib/systems/pathfinder2e.ts`
- Create: `lib/systems/generic.ts`

- [ ] **Step 1: Write Daggerheart system preset**
Create `lib/systems/daggerheart.ts` containing the rules layout, labels, and stats for Daggerheart:
```typescript
export interface SystemField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'textarea';
  optional?: boolean;
}

export interface SystemPreset {
  id: string;
  name: string;
  details: SystemField[];
  stats: Record<string, { abbreviation: string; label: string; default: number }>;
}

export const DaggerheartSystem: SystemPreset = {
  id: 'daggerheart',
  name: 'Daggerheart',
  details: [
    { key: 'ancestry', label: 'Ancestry', type: 'string' },
    { key: 'community', label: 'Community', type: 'string' },
    { key: 'class', label: 'Class', type: 'string' },
    { key: 'subclass', label: 'Subclass', type: 'string' },
  ],
  stats: {
    agility: { abbreviation: 'AGI', label: 'Agility', default: 0 },
    strength: { abbreviation: 'STR', label: 'Strength', default: 0 },
    finesse: { abbreviation: 'FIN', label: 'Finesse', default: 0 },
    instinct: { abbreviation: 'INS', label: 'Instinct', default: 0 },
    presence: { abbreviation: 'PRE', label: 'Presence', default: 0 },
    knowledge: { abbreviation: 'KNO', label: 'Knowledge', default: 0 },
  }
};
```

- [ ] **Step 2: Write D&D 5e system preset**
Create `lib/systems/dnd5e.ts`:
```typescript
import { SystemPreset } from './daggerheart';

export const DnD5eSystem: SystemPreset = {
  id: 'dnd5e',
  name: 'Dungeons & Dragons 5th Edition',
  details: [
    { key: 'race', label: 'Race', type: 'string' },
    { key: 'background', label: 'Background', type: 'string' },
    { key: 'class', label: 'Class', type: 'string' },
    { key: 'subclass', label: 'Archetype', type: 'string', optional: true },
  ],
  stats: {
    strength: { abbreviation: 'STR', label: 'Strength', default: 10 },
    dexterity: { abbreviation: 'DEX', label: 'Dexterity', default: 10 },
    constitution: { abbreviation: 'CON', label: 'Constitution', default: 10 },
    intelligence: { abbreviation: 'INT', label: 'Intelligence', default: 10 },
    wisdom: { abbreviation: 'WIS', label: 'Wisdom', default: 10 },
    charisma: { abbreviation: 'CHA', label: 'Charisma', default: 10 },
  }
};
```

- [ ] **Step 3: Write Pathfinder 2e system preset**
Create `lib/systems/pathfinder2e.ts`:
```typescript
import { SystemPreset } from './daggerheart';

export const Pathfinder2eSystem: SystemPreset = {
  id: 'pathfinder2e',
  name: 'Pathfinder 2nd Edition',
  details: [
    { key: 'ancestry', label: 'Ancestry', type: 'string' },
    { key: 'heritage', label: 'Heritage', type: 'string' },
    { key: 'background', label: 'Background', type: 'string' },
    { key: 'class', label: 'Class', type: 'string' },
  ],
  stats: {
    strength: { abbreviation: 'STR', label: 'Strength', default: 10 },
    dexterity: { abbreviation: 'DEX', label: 'Dexterity', default: 10 },
    constitution: { abbreviation: 'CON', label: 'Constitution', default: 10 },
    intelligence: { abbreviation: 'INT', label: 'Intelligence', default: 10 },
    wisdom: { abbreviation: 'WIS', label: 'Wisdom', default: 10 },
    charisma: { abbreviation: 'CHA', label: 'Charisma', default: 10 },
  }
};
```

- [ ] **Step 4: Write Generic system preset**
Create `lib/systems/generic.ts`:
```typescript
import { SystemPreset } from './daggerheart';

export const GenericSystem: SystemPreset = {
  id: 'generic',
  name: 'Generic TTRPG System',
  details: [
    { key: 'concept', label: 'Character Concept', type: 'string' },
    { key: 'faction', label: 'Faction / Guild', type: 'string', optional: true },
  ],
  stats: {
    power: { abbreviation: 'PWR', label: 'Power', default: 1 },
    finesse: { abbreviation: 'FIN', label: 'Finesse', default: 1 },
    mind: { abbreviation: 'MND', label: 'Mind', default: 1 },
  }
};
```

- [ ] **Step 5: Write index.ts to export all systems**
Create `lib/systems/index.ts`:
```typescript
import { DaggerheartSystem, SystemPreset } from './daggerheart';
import { DnD5eSystem } from './dnd5e';
import { Pathfinder2eSystem } from './pathfinder2e';
import { GenericSystem } from './generic';

export const systemsRegistry: Record<string, SystemPreset> = {
  daggerheart: DaggerheartSystem,
  dnd5e: DnD5eSystem,
  pathfinder2e: Pathfinder2eSystem,
  generic: GenericSystem,
};

export function getSystemPreset(id: string): SystemPreset {
  return systemsRegistry[id] || GenericSystem;
}
```

- [ ] **Step 6: Write a test to verify system retrieval works**
Create `lib/systems/systems.test.ts`:
```typescript
import { expect, test } from 'bun:test';
import { getSystemPreset } from './index';

test('retrieves dnd5e preset with correct stats', () => {
  const dnd = getSystemPreset('dnd5e');
  expect(dnd.name).toBe('Dungeons & Dragons 5th Edition');
  expect(dnd.stats.strength.abbreviation).toBe('STR');
});

test('falls back to generic preset for unknown id', () => {
  const system = getSystemPreset('unknown-system');
  expect(system.id).toBe('generic');
});
```

- [ ] **Step 7: Run tests and commit**
Run: `bun test lib/systems/systems.test.ts`
Expected: PASS
Commit: `git add lib/systems/ && git commit -m "feat: add shared game system presets registry"`

---

### Task 2: Update Data Loaders and Custom Types

**Files:**
- Modify: `types/index.ts`
- Modify: `lib/data.ts`

- [ ] **Step 1: Expand CampaignData type in `types/index.ts`**
Add Settings, Theme Preset, Calendar, and Custom Theme typings.
```typescript
export interface ThemeColorSet {
  surface: string;
  surfaceDim?: string;
  surfaceContainerLowest?: string;
  surfaceContainerLow?: string;
  surfaceContainer?: string;
  surfaceContainerHigh?: string;
  surfaceContainerHighest?: string;
  primary: string;
  primaryContainer?: string;
  primaryDim?: string;
  onSurface: string;
  outlineVariant?: string;
  secondary?: string;
  secondaryContainer?: string;
  onSecondaryContainer?: string;
  tertiary?: string;
  tertiaryContainer?: string;
}

export interface CalendarConfig {
  type: 'gregorian' | 'custom';
  eras?: { name: string; abbreviation: string; startYear: number }[];
  months?: { name: string; days: number }[];
  daysOfWeek?: string[];
  hoursPerDay?: number;
}

export interface CampaignSettings {
  gameSystem: string;
  themePreset: string;
  backgrounds?: Record<string, string>;
  calendar?: CalendarConfig;
  customTheme?: {
    light: ThemeColorSet;
    dark: ThemeColorSet;
  };
}

export interface CampaignData {
  settings?: CampaignSettings; // Added optional settings block
  home: HomeData;
  locations: Location[];
  timeline: TimelineData;
  players: Player[];
  npcs: NPC[];
}
```

- [ ] **Step 2: Update `lib/data.ts` to include default settings if missing**
Ensure that if no settings block is found in the yaml, a default `daggerheart` + `fantasy-parchment` configuration is provided.
```typescript
// Add default settings fallback inside getCampaignData()
if (!data.settings) {
  data.settings = {
    gameSystem: 'daggerheart',
    themePreset: 'fantasy-parchment'
  };
}
```

- [ ] **Step 3: Run project tests and commit**
Run: `bun test`
Expected: PASS
Commit: `git commit -am "feat: extend campaign schema typings and default loaders"`

---

### Task 3: Create Dynamic CSS Theme and Page Background Injection

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write Preset Theme definitions in `app/layout.tsx`**
Define helper map of hex variables for all core theme presets (Fantasy Parchment, Gothic Horror, Whimsical, Gritty, Epic, Cyberpunk, Sci-Fi) in `app/layout.tsx`.

- [ ] **Step 2: Generate dynamic style tag in RootLayout**
Read `campaign.yml` settings. Compile the selected preset values (or customTheme overrides) into a CSS string containing custom property variables on `:root` and `.dark`.

```typescript
const themeString = `
  :root {
    --surface: ${colors.light.surface};
    --primary: ${colors.light.primary};
    --on-surface: ${colors.light.onSurface};
    ...
  }
  .dark {
    --surface: ${colors.dark.surface};
    --primary: ${colors.dark.primary};
    --on-surface: ${colors.dark.onSurface};
    ...
  }
`;
```

- [ ] **Step 3: Inject Dynamic Background CSS**
If backgrounds are configured for the page, generate class overlays or direct background styles matching those targets.

- [ ] **Step 4: Build project and verify no errors**
Run: `bun run build`
Expected: PASS
Commit: `git commit -am "feat: add dynamic CSS theme variables & custom page background injection"`

---

### Task 4: Dynamic Admin Form Customization

**Files:**
- Modify: `admin/lib/schemas/campaign.ts`
- Modify: `admin/components/AutoForm.tsx`

- [ ] **Step 1: Read active system schema**
Adjust the React AutoForm generator to resolve the schema based on the settings key in `campaign.yml`.

- [ ] **Step 2: Adapt Player fields dynamically**
Instead of hard-coded `PlayerSchema` fields, build the form components programmatically by mapping through the selected game system's `details` and `stats`.

- [ ] **Step 3: Run linter and compile admin**
Run: `bun --cwd admin run lint && bun --cwd admin run build`
Expected: PASS
Commit: `git commit -am "feat: dynamic admin form fields derived from active game system schema"`

---

### Task 5: Scaffolding setup CLI

**Files:**
- Create: `cli/init-campaign.ts`
- Modify: `package.json`

- [ ] **Step 1: Create interactive wizard code using `commander`**
Create `cli/init-campaign.ts` to query the user for brand, RPG system, style presets, custom calendar structures.
- [ ] **Step 2: Clean and format YAML**
Use `js-yaml` to output the new config to `data/campaign.yml`, wiping previous player/NPC mock data to deliver a clean starter workspace.
- [ ] **Step 3: Wire up run scripts**
Add `"setup": "bun run cli/init-campaign.ts"` inside `"scripts"` in `package.json`.

- [ ] **Step 4: Verify manual run works, then commit**
Run: `bun run setup --help`
Commit: `git add cli/init-campaign.ts package.json && git commit -m "feat: add interactive setup wizard cli command"`
