import {
  Key,
  Region,
  keyboard,
  mouse,
  randomPointIn,
  sleep,
  straightTo,
} from '@nut-tree/nut-js';
import { getRandomValues } from '../modules/random';
import { getImage } from '../modules/hasImage';
import { rainCastingSingleton } from './buff';
import { favoriteSingleton } from './favorite';
import { additionalEqualSlotSingleton } from './additionalEqualSlot';

export class Dissolution {
  public count = 0;

  private rainCasting = rainCastingSingleton;
  private favorite = favoriteSingleton;
  private additionalEqualSlot = additionalEqualSlotSingleton;

  private finishDelayMs = 5000;
  private cylinderRegion = new Region(1539, 793, 45, 77);
  private glovePositionRegion = new Region(1544, 234, 31, 31);
  private dissolutionButtonRegion = new Region(266, 733, 84, 34);

  constructor(
    public key: Key = Key.Num6,
    private _sleepMs = 350,
  ) {}

  public get sleepMs() {
    return this._sleepMs + getRandomValues(0, 20);
  }

  public async update() {
    await this.onStart();
    await this.openDissolutionView();

    await this.registerMaterial();

    await mouse.move(straightTo(randomPointIn(this.dissolutionButtonRegion)));
    await sleep(this.sleepMs);
    await mouse.leftClick();

    this.count += 1;

    await sleep(this.finishDelayMs);
    await this.onFinish();
  }

  private async onStart() {
    mouse.config.mouseSpeed = getRandomValues(2500, 3500);
    await this.additionalEqualSlot.change('분해');
    await this.favorite.active('전문가용 실크방직 장갑');
    await this.useBuff();
    await this.changeEmptyHand();
  }

  private async changeEmptyHand() {
    const hasCylinder = await getImage(
      `./src/assets/dissolution/cylinder.png`,
      { searchRegion: this.cylinderRegion },
    );

    if (hasCylinder != null) {
      await keyboard.pressKey(Key.Grave);
      await keyboard.releaseKey(Key.Grave);
      await sleep(this.sleepMs);
    }
  }

  private async onFinish() {}

  private async useBuff() {
    await this.rainCasting.update();
  }

  private async openDissolutionView() {
    await keyboard.pressKey(this.key);
    await keyboard.releaseKey(this.key);
    await sleep(this.sleepMs);
  }

  private async registerMaterial() {
    await mouse.move(straightTo(randomPointIn(this.glovePositionRegion)));
    await sleep(this.sleepMs);

    await keyboard.pressKey(Key.LeftAlt);
    await mouse.leftClick();
    await keyboard.releaseKey(Key.LeftAlt);
    await sleep(this.sleepMs);
  }
}
