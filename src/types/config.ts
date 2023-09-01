export interface Config {
  maplestory: Maplestory;
}

export interface Maplestory {
  channelChange: boolean;
  goToArdentmill: boolean;
  account: Account;
  charactor: Charactor[];
}

export interface Account {
  useTwoFactor: boolean;
  twoFactor: string;
}

export interface Charactor {
  name: string;
  order: number;
  keybinding: Keybinding;
  fatigue: number;
  alchemy: Alchemy[];
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
  fatigue: number;
}
