import { logger } from './modules/logger';
import { Key, keyboard, mouse, screen } from '@nut-tree/nut-js';
import { Tailoring } from './container/tailoring';
import { additionalEqualSlotSingleton } from './container/additionalEqualSlot';
import { Dissolution } from './container/dissolution';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { Snapshot } from './container/snapshot';

async function main() {
  process.beep();
  process.release();
  process.time();
  screen.config.highlightDurationMs = 3000;
  mouse.config.autoDelayMs = 80;
  keyboard.config.autoDelayMs = 80;

  const trailoring = new Tailoring(Key.Num2, 350, {
    isPerfectFinish: false,
    usesLeftCount: 11,
  });
  const dissolution = new Dissolution(Key.Num6, 350);
  const asyncTask = new AsyncTask();

  trailoring.createCount = 46;

  let loopCount = 1;

  await asyncTask
    .build(
      () => trailoring.update(),
      () => trailoring.createCount < 50 * loopCount,
    )
    .build(() => logger(`${trailoring.createCount}번 만들고 분해 시작함.`))
    .build(
      () => dissolution.update(),
      () => dissolution.count < trailoring.createCount,
    )
    .sleep(2000)
    .build(() => additionalEqualSlotSingleton.change('일반'))
    .build(() => logger(`${trailoring.createCount}번 만들고 분해함`))
    .build(() => {
      loopCount += 1;
    })
    .setInfinityLoop()
    .run()
    .catch(console.error)
    .finally(() => {
      process.timeEnd();
      process.beep();
    });
}

main();
