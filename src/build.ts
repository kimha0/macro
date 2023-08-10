import { logger } from "./modules/logger";
import { Key, mouse, screen } from "@nut-tree/nut-js";
import { Tailoring } from "./container/tailoring";
import { additionalEqualSlotSingleton } from "./container/additionalEqualSlot";
import { Dissolution } from "./container/dissolution";
import { processSingleton as process } from "./container/process";
import { AsyncTask } from "./container/asyncTask";

async function main() {
  process.beep();
  process.release();
  process.time();
  screen.config.highlightDurationMs = 3000;
  mouse.config.autoDelayMs = 200;

  const trailoring = new Tailoring(Key.Num2, 350, { isPerfectFinish: false, usesLeftCount: 3 });
  const dissolution = new Dissolution(Key.Num6, 350);
  const asyncTask = new AsyncTask();

  trailoring.createCount = 39;

  await asyncTask
    .build(() => trailoring.update(), 50)
    .build(() => dissolution.update(), 50)
    .sleep(2000)
    .build(() => additionalEqualSlotSingleton.change('일반'))
    .build(() => logger(`${trailoring.createCount}번 만들고 분해함`))
    .setInfinityLoop()
    .run()
    .catch(console.error)
    .finally(() => {
      process.timeEnd();
      process.beep();
    });
}

main();

