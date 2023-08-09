import { Key, Region, keyboard, mouse, randomPointIn, sleep, straightTo } from "@nut-tree/nut-js";
import { getRandomValues } from "../modules/random";
import { getImage } from "../modules/hasImage";
import { inventorySingleton } from "./inventoryContainer";

type ActiveType = '옷본 - 전문가용 실크방직 장갑' | '전문가용 실크방직 장갑';

export class Favorite {
  private manualRegion = new Region(1692, 158, 20, 23);
  private gloveRegion = new Region(1662, 158, 20, 23);

  private inventory = inventorySingleton;

  constructor(public sleepMs = 350) { }

  public async active(type: ActiveType, closeInventory = false) {
    await this.inventory.open();
    await sleep(1500);

    switch (type) {
      case '옷본 - 전문가용 실크방직 장갑': {
        const region = await getImage(`./src/assets/favorite/manualActive.png`, { searchRegion: this.manualRegion });
        if (region != null) {
          return
        }

        await mouse.move(straightTo(randomPointIn(this.manualRegion)))
        await sleep(this.sleepMs);
        await mouse.leftClick();
        await sleep(this.sleepMs);
        break;
      }

      case '전문가용 실크방직 장갑': {
        const region = await getImage(`./src/assets/favorite/gloveActive.png`, { searchRegion: this.gloveRegion });

        if (region != null) {
          return
        }

        await mouse.move(straightTo(randomPointIn(this.gloveRegion)))
        await sleep(this.sleepMs);
        await mouse.leftClick();
        await sleep(this.sleepMs);
        break;
      }
    }

    if (closeInventory) {
      await this.inventory.close();
      await sleep(1000);
    }
  }

  public async onFinish() {}
}

export const favoriteSingleton = new Favorite();