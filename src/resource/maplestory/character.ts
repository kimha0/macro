import { Key } from '@nut-tree/nut-js';
import { Alchemy } from '../../types/config';

interface KeyBinding {
  jump: Key;
  productionSkill: Key;
  itemInventory: Key;
  npcAction: Key;
}

export class Character {
  constructor(
    public name: string,
    public order: number,
    public keybinding: KeyBinding,
    public alchemis: Alchemy[],
  ) {}
}
