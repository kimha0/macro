import { Key, Region, keyboard, mouse, randomPointIn, sleep, straightTo } from "@nut-tree/nut-js";
import { getRandomValues } from "../modules/random";
import { getImage } from "../modules/hasImage";
import { inventorySingleton } from "./inventoryContainer";

type ActiveType = '일반' | '분해';

export class AdditionalEqualSlot {
  public currentEqualSlot : ActiveType | null = null;

  constructor(public sleepMs = 350) { }

  public async change(type: ActiveType) {
    if (this.currentEqualSlot == null) {
      await this.change분해();
      await this.change일반();

      this.currentEqualSlot = '일반';
    }
    
    if (type === this.currentEqualSlot) {
      return;
    }


    switch (type) {
      case '분해': {
        await this.change분해();
        this.currentEqualSlot = '분해';

        break;
      }

      case '일반': {
        await this.change일반();
        this.currentEqualSlot = '일반';

        break;
      }
    }

    this.onFinish();
  }

  public async onFinish() {}

  private async change분해() {
    await keyboard.pressKey(Key.LeftControl);
    await keyboard.pressKey(Key.S);
    await keyboard.releaseKey(Key.S);
    await keyboard.releaseKey(Key.LeftControl);
    await sleep(1500);
  }

  private async change일반() {
    await keyboard.pressKey(Key.LeftControl);
    await keyboard.pressKey(Key.A);
    await keyboard.releaseKey(Key.A);
    await keyboard.releaseKey(Key.LeftControl);
    await sleep(1500);
  }
}

export const additionalEqualSlotSingleton = new AdditionalEqualSlot();