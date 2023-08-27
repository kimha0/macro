import { Key, keyboard, sleep } from '@nut-tree/nut-js';

export class Channel {
  constructor(public delay = 5000) {}

  public async changeNextChennel() {
    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await keyboard.pressKey(Key.Right);
    await keyboard.releaseKey(Key.Right);

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await sleep(this.delay);
  }
}
