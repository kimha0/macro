import { Key, keyboard, mouse, randomPointIn, Region, sleep, straightTo } from "@nut-tree/nut-js";
import { getImage } from "../../modules/hasImage";
import { findRectangleAreaByCorners } from "../../modules/carculator";
import { loadImage } from "../../modules/loadImage";

type MapleItemTab = '장비' | '소비' | '기타';

export class MapleStoryInventory {
  private resourcePath = `src/assets/maple/item`
  constructor(public key: Key = Key.I, public sleepMs = 350) { }

  public async isOpen() {
    const mesoRegion = await getImage(`${this.resourcePath}/메소버튼.png`);

    return mesoRegion != null;
  }

  public async getMaplestoryItemActiveTab(tab: MapleItemTab) {
    return getImage(`${this.resourcePath}/${tab}.png`);
  }

  public async moveTab(tab: MapleItemTab) {
    const tabImage = await this.getMaplestoryItemActiveTab(tab);
  
    if (tabImage == null) {
      return;
    }

    await mouse.move(straightTo(randomPointIn(tabImage)));
    await mouse.leftClick();
    await sleep(500);
    await mouse.move(straightTo(randomPointIn(new Region(0, 0, 0, 0))));
    await sleep(500);
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

  public async getItemInventoryRegion() {
    const leftTop = await getImage(`${this.resourcePath}/left-top.png`);
    const rightBottom = await getImage(`${this.resourcePath}/right-bottom.png`);
  
    if (leftTop == null || rightBottom == null) {
      throw Error('아이템 창 좌표를 가져오지 못함.');
    }
  
    const { height, left, top, width } = await findRectangleAreaByCorners(leftTop, rightBottom);
  
    const region = new Region(left, top + 21, width + 85, height - 45)
  
    return region;
  }

  public async getItemRegion() {
    const { left, top } = await this.getItemInventoryRegion();
    const firstOffset = { top: 9, left: 6 };
    const itemsOffset = { top: 9, left: 9 };
    const rectSize = 33;
  
    const itemSize = { x: 16, y: 8 };
  
  
    const maps: (Region | null)[][] = []
  
    for (let y = 0; y < itemSize.y; ++y) {
      if (maps[y] == null) {
        maps[y] = [];
      }
  
      for (let x = 0; x < itemSize.x; ++x) {
        
        const l = left + firstOffset.left + (x * (itemsOffset.left + rectSize));
        const t = top + firstOffset.top + (y * (itemsOffset.top + rectSize));
  
        const region = new Region(l, t, rectSize, rectSize);
  
        const image = await loadImage(`${this.resourcePath}/못쓰는_아이템창.png`);
        const result = await getImage(image, { searchRegion: region });
  
        if (result != null) {
          maps[y][x] = null;
        } else {
          maps[y][x] = region;
        }
      }
    }
  
    return maps;
  }
  
  
}

export const mapleStoryInventorySingleton = new MapleStoryInventory(Key.I, 350);
