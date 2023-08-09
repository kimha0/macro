import { Key, keyboard, Region } from "@nut-tree/nut-js";
import { getImage } from "../modules/hasImage";

export class Inventory {
  constructor(public key: Key, public sleepMs = 350) { }

  private inventoryIconRegion = new Region(886, 1007, 57, 57);

  public async isOpen() {
    const region = await getImage(`./src/assets/items/아이템창_열림.png`, { searchRegion: this.inventoryIconRegion });
    return region != null;
  }

  public async open() {
    const isOpend = await this.isOpen();

    if (!isOpend) {
      keyboard.pressKey(this.key);
      keyboard.releaseKey(this.key);
    }
  }

  public async close() {
    const isOpend = await this.isOpen();

    if (isOpend) {
      keyboard.pressKey(this.key);
      keyboard.releaseKey(this.key);
    }
  }
}

export const inventorySingleton = new Inventory(Key.I, 350);
