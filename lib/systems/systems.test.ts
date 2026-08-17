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
