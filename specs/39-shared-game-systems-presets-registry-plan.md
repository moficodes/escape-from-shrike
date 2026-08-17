# Task 1: Shared Game Systems Presets Registry Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a modular registry under `lib/systems/` that contains core rulesets, stats, and metadata for different tabletop RPG systems (Daggerheart, D&D 5e, Pathfinder 2e, and a generic system fallback) to support modular rendering.

**Architecture:** 
1. Create individual preset modules for each system (`daggerheart.ts`, `dnd5e.ts`, `pathfinder2e.ts`, `generic.ts`).
2. Export unified system types and a centralized registry from an `index.ts` entry point.
3. Verify retrieving both valid systems and fallback systems works properly via a comprehensive test file using `bun:test`.

**Tech Stack:** TypeScript, Bun (test runner).

---

## File Structure & Dependencies

We will create the following files:
- **Create**: `lib/systems/daggerheart.ts` — Contains core types (`SystemField`, `SystemPreset`) and the `DaggerheartSystem` preset.
- **Create**: `lib/systems/dnd5e.ts` — Contains the `DnD5eSystem` preset.
- **Create**: `lib/systems/pathfinder2e.ts` — Contains the `Pathfinder2eSystem` preset.
- **Create**: `lib/systems/generic.ts` — Contains the fallback `GenericSystem` preset.
- **Create**: `lib/systems/index.ts` — Registry map and `getSystemPreset` helper.
- **Create**: `lib/systems/systems.test.ts` — Test suite for verifying the registry logic.

---

## Implementation Tasks

### Task 1: Shared Game Systems Presets Registry

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

- [ ] **Step 7: Run tests and verify success**
Run: `bun test lib/systems/systems.test.ts`
Expected: PASS

- [ ] **Step 8: Run project linting and build checks to ensure type safety**
Run: `bun run lint` (or relevant compiler verification)

- [ ] **Step 9: Commit the files**
Run: `git add lib/systems/ && git commit -m "feat: add shared game system presets registry"`
