import { Button, Key, Point, Region, keyboard, mouse, randomPointIn, sleep, straightTo } from "@nut-tree/nut-js";
import { getText } from "../modules/ocr";
import { getRandomValues } from "../modules/random";
import { getImage, hasImage } from "../modules/hasImage";
import { songOfRichYearSingleton } from "./buff";
import { inventorySingleton } from "./inventoryContainer";
import { repairSingleton } from "./repair";
import { favoriteSingleton } from "./favorite";
import { additionalEqualSlotSingleton } from "./additionalEqualSlot";
import { Snapshot } from "./snapshot";

interface Config {
  isPerfectFinish: boolean;
  usesLeftCount: number;
}

export class Tailoring {
  public count = 0;
  public createCount = 0;
  public usesLeftCount = 30;

  private songOfRichYear = songOfRichYearSingleton;
  private inventory = inventorySingleton;
  private repair = repairSingleton;
  private favorite = favoriteSingleton;
  private additionalEqualSlot = additionalEqualSlotSingleton;


  private finishDelayMs = 5000;
  private stepRegion = new Region(276, 314, 280, 98);
  private stepTextRegion = new Region(356, 314, 110, 12);
  private autoMaterialRegisterButtonRegion = new Region(513, 507, 169, 24);
  private startButtonRegion = new Region(405, 762, 64, 30);
  private 마감점Region = new Region(42, 376, 196, 196);
  private rightHandRegion = new Region(1636, 794, 44, 75);
  private changeMenualPositionRegion = new Region(1544, 234, 28, 28);

  private manualRegion = new Region(278, 316, 69, 93);
  private cancelRegion = new Region(497, 762, 64, 30);

  constructor(public key: Key = Key.Num2, private _sleepMs = 350, public config?: Config) {
    this.usesLeftCount = config?.usesLeftCount ?? 30;
  }

  public get sleepMs() {
    return this._sleepMs + getRandomValues(0, 20);
  }

  public async update() {
    await this.onStart();
    await this.changeManual();

    await this.useBuff();

    await this.openTrailoringView();
    const step = await this.getStep();

    if (step === '버그') {
      await mouse.move(straightTo(randomPointIn(this.cancelRegion)))
      await mouse.leftClick();

      await sleep(1000);
      return;
    }

    if (step === '마감') {
      await this.registerMaterial();
      await this.start();
      await sleep(this.sleepMs + 150);

      await this.clickStartHit();
      await this.clickEndHit();
      await sleep(this.sleepMs + 150);

      await this.clickStartHit();
      await this.clickEndHit();
      await sleep(this.sleepMs + 150);

      await this.clickStartHit();
      await this.clickEndHit();
      await sleep(this.sleepMs);
      
      await this.finalHit();
      this.createCount += 1;
    }

    if (step === '제작') {
      await this.registerMaterial();
      await this.start();
    }

    this.count += 1;
    this.usesLeftCount -= 1;

    await sleep(this.finishDelayMs);
    await this.onFinish();
  }

  private async onStart() {
    mouse.config.mouseSpeed = getRandomValues(2500, 3500);
    await this.additionalEqualSlot.change('일반');
    
    if (this.count > 30) {
      await sleep(1000);
      await this.repair.start();
    }

  }

  private async onFinish() {
    await this.changeManual();
  }

  public async changeManual() {
    if (this.usesLeftCount < 1) {
      await this.inventory.open();
      await sleep(1500);
      await this.favorite.active('옷본 - 전문가용 실크방직 장갑');
      await sleep(this.sleepMs);

      const randomPoint = await randomPointIn(this.rightHandRegion)

      await mouse.move(straightTo(randomPoint));
      await sleep(getRandomValues(500, 600));
      await mouse.rightClick();

      await sleep(getRandomValues(500, 600));

      const throwItemButtonRegion = new Point(randomPoint.x, randomPoint.y + 140);

      await mouse.move(straightTo(throwItemButtonRegion));
      // NOTE(@kimha0): There is a slight delay when the item window opens.
      await sleep(getRandomValues(350, 400));

      await mouse.leftClick();
      await sleep(getRandomValues(350, 400));


      await mouse.move(straightTo(randomPointIn(this.changeMenualPositionRegion)));
      await sleep(this.sleepMs);
      await keyboard.pressKey(Key.LeftControl);
      await mouse.leftClick();
      await keyboard.releaseKey(Key.LeftControl);
      await sleep(this.sleepMs);

      await this.inventory.close();

      await sleep(1000);

      this.usesLeftCount = 30;
    }
  }

  private async useBuff() {
    await this.songOfRichYear.update();
  }

  private async openTrailoringView() {
    await keyboard.pressKey(this.key);
    await keyboard.releaseKey(this.key);
    await sleep(this.sleepMs);
  }

  private async clickStartHit() {
    const region = await getImage('./src/assets/trailoring/start1.png', { searchRegion: this.마감점Region });

    if (region == null) {
      throw new Error ('start 지점을 찾지 못함');
    }
    
    if (this.config?.isPerfectFinish) {
      await mouse.move(straightTo(new Point(region.left + 11, region.top + 24)));
    } else {

      const randomPointRegion = new Region(region.left + 1, region.top + 14, 20, 20);
      await mouse.move(straightTo(randomPointIn(randomPointRegion)));
    }

    await mouse.pressButton(Button.LEFT);
  }

  private async clickEndHit() {
    const region = await getImage('./src/assets/trailoring/end.png', { searchRegion: this.마감점Region });

    if (region == null) {
      throw new Error ('end 지점을 찾지 못함');
    }
    
    if (this.config?.isPerfectFinish) {
      await mouse.move(straightTo(new Point(region.left + 8, region.top + 24)));
    } else {

      const randomPointRegion = new Region(region.left - 2, region.top + 14, 20, 20)
      await mouse.move(straightTo(randomPointIn(randomPointRegion)));
    }

    await mouse.releaseButton(Button.LEFT);
  }

  private async finalHit() {
    await mouse.leftClick();
  }

  private async registerMaterial() {
    await mouse.move(straightTo(randomPointIn(this.autoMaterialRegisterButtonRegion)));
    await mouse.leftClick();
    await sleep(this.sleepMs);
  }

  private async start() {
    await mouse.move(straightTo(randomPointIn(this.startButtonRegion)));
    await mouse.leftClick();
    await sleep(this.sleepMs);
  }

  private async getStep() {
    const bugImage = await getImage(`src/assets/trailoring/bug.png`, { searchRegion: this.manualRegion });

    if (bugImage != null) {
      return '버그';
    }

    const text = await getText(this.stepTextRegion);

    if (text.includes('마지막 단계')) {
      return '마감';
    }

    return '제작';
  }

}