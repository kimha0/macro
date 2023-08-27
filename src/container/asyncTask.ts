import { sleep } from '@nut-tree/nut-js';
import { processSingleton } from './process';

export class AsyncTask {
  private process = processSingleton;
  private stack: Function[] = [];
  private _infinityLoop = false;

  private async pause() {
    return new Promise(async (resolve) => {
      while (true) {
        if (this.process.pause) {
          await sleep(500);

          continue;
        }

        break;
      }

      resolve(null);
    });
  }

  private getCondition(
    condition: (() => boolean) | boolean | number,
    playCount: number,
  ) {
    if (typeof condition === 'number') {
      return playCount < condition;
    }

    if (typeof condition === 'boolean') {
      return condition;
    }

    if (typeof condition === 'function') {
      return condition();
    }
  }

  public build(
    fn: Function,
    condition: (() => boolean) | boolean | number = 1,
  ) {
    this.stack.push(async () => {
      let playCount = 0;

      while (this.getCondition(condition, playCount)) {
        playCount++;
        await this.pause();
        await fn();
      }
    });

    return this;
  }

  public sleep(delay: number) {
    this.stack.push(async () => {
      await sleep(delay);
    });

    return this;
  }

  public setInfinityLoop() {
    this._infinityLoop = true;

    return this;
  }

  public async run() {
    do {
      for await (const fn of this.stack) {
        await fn();
      }
    } while (this._infinityLoop);
  }
}
