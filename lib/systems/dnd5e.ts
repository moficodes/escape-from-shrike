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
