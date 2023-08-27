import { Key } from "@nut-tree/nut-js";

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
  ) { }
}