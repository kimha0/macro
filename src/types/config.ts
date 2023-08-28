export interface Config {
  maplestory: Maplestory;
}

export interface Maplestory {
  account: Account;
  charactor: Charactor[];
  alchemy: Alchemy[];
}

export interface Account {
  useTwoFactor: boolean;
  twoFactor: string;
}

export interface Charactor {
  name: string;
  order: number;
  keybinding: Keybinding;
}

export interface Keybinding {
  itemInventory: number;
  jump: number;
  npcAction: number;
  productionSkill: number;
}

export interface Alchemy {
  name: string;
  cooltime: number;
  order: number;
}
