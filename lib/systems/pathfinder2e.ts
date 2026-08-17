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
