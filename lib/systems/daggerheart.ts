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
