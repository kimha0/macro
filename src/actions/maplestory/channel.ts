import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { getConfig } from '../../modules/getConfig';

export class Channel {
  public config = getConfig();

  constructor(public delay = 5000) {}

  public async changeNextChennel() {
    const channelChange = (await this.config).maplestory.channelChange;
    if (!channelChange) {
      return;
    }

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
