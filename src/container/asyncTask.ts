import { sleep } from "@nut-tree/nut-js";
import { processSingleton } from "./process";

export class AsyncTask {
  private process = processSingleton;
  private stack: Function[] = [];
  private _infinityLoop = false;

  private async pause() {
    return new Promise(async resolve => {
      while (true) {
        if (this.process.pause) {
          await sleep(500);

          continue
        }

        break;
      }

      resolve(null);
    })
  }

  public build(fn: Function, loopCount: number = 1) {
    this.stack.push(async () => {
      let playCount = 0;

      while (playCount < loopCount) {
        playCount++;
        await this.pause();
        await fn();
      }
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
    } while (this._infinityLoop)
  }
}