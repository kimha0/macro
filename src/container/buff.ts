import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { getRandomValues } from '../modules/random';

class Buff {
  time: Date | null = null;
  constructor(
    public key: Key,
    public seconds: number,
    public delay: number,
    public sleepMs = 350,
  ) {}

  public async update(force = false) {
    if (
      this.time == null ||
      Math.round((new Date().getTime() - this.time.getTime()) / 1000) >
      this.seconds ||
      force
    ) {
      await keyboard.pressKey(this.key);
      await keyboard.releaseKey(this.key);
      await sleep(
        this.delay + getRandomValues(this.sleepMs, this.sleepMs + 20),
      );

      this.time = new Date();

      await this.onFinish();
    }
  }

  public async onFinish() {}
}

class SongOfRichYear extends Buff {
  static BuffTime = 140;
  constructor() {
    super(Key.Num8, SongOfRichYear.BuffTime, 350, 5000);
  }

  public async onFinish(): Promise<void> {
    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);
    await sleep(500);
  }
}

class RainCasting extends Buff {
  static BuffTime = 120;
  constructor() {
    super(Key.F8, SongOfRichYear.BuffTime, 10000, 350);
  }

  public async onFinish(): Promise<void> {
    await sleep(500);
  }
}

class PetFood extends Buff {
  static BuffTime = 420;
  constructor() {
    super(Key.Insert, PetFood.BuffTime, 0, 350);
  }

  public async onFinish(): Promise<void> {
    await sleep(500);
  }
}

export const songOfRichYearSingleton = new SongOfRichYear();
export const rainCastingSingleton = new RainCasting();
export const petFoodSingleton = new PetFood();
