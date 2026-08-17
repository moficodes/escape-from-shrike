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
