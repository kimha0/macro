import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { petFoodSingleton } from '../buff';

export class MapleLandContainer {
  private count = 0;
  private 명령어 = [
    'tkfkdgo',
    'dkswdk',
    'EoWl',
    'dkseho',
    'ghssksek',
    'ghsskffo',
    'qkqh',
    'EhdRo',
    'ajdcjddl',
    'aldnj',
    'tnl',
  ];

  public async tick() {
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);
    await keyboard.type(this.명령어[this.count % this.명령어.length]);
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);
    await petFoodSingleton.update();
    this.count += 1;
    await sleep(5000);
  }
}
