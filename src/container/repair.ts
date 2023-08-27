import {
  Region,
  mouse,
  randomPointIn,
  sleep,
  straightTo,
} from '@nut-tree/nut-js';
import { getRandomValues } from '../modules/random';
import { getErinTime } from '../modules/getErinTime';

class Repair {
  public lastRepairDay = getErinTime().days;

  private repairButtonRegion = new Region(1437, 1041, 28, 28);
  private useButtonRegion = new Region(1040, 623, 54, 21);
  private allRepairButtonRegion = new Region(1697, 626, 208, 30);
  private confirmButtonRegion = new Region(1137, 595, 34, 21);
  private exitButtonRegion = new Region(1809, 734, 96, 20);

  constructor(public sleepMs = 350) {}

  public async start() {
    const { days } = getErinTime();
    if (this.lastRepairDay >= days) {
      return;
    }

    await this.repair();
    this.lastRepairDay = days;

    await this.onFinish();
  }

  public async onFinish() {}

  private async repair() {
    await mouse.move(straightTo(randomPointIn(this.repairButtonRegion)));
    await mouse.leftClick();
    await sleep(1500);

    await mouse.move(straightTo(randomPointIn(this.useButtonRegion)));
    await mouse.leftClick();
    // NOTE(@kimha0): network condition에 따라 좀 느리게 보일 수 있음.
    await sleep(1500);

    await mouse.move(straightTo(randomPointIn(this.allRepairButtonRegion)));
    await mouse.leftClick();

    await sleep(1500);
    await mouse.leftClick();

    await sleep(1500);
    await mouse.move(straightTo(randomPointIn(this.confirmButtonRegion)));
    await mouse.leftClick();

    await sleep(1500);
    await mouse.move(straightTo(randomPointIn(this.exitButtonRegion)));
    await mouse.leftClick();

    await sleep(getRandomValues(this.sleepMs, this.sleepMs * 2));
  }
}

export const repairSingleton = new Repair();
