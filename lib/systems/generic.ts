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
