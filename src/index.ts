import { keyboard, mouse, screen, sleep } from '@nut-tree/nut-js';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { setup } from './modules/setup';
import { sendWebhook } from './modules/discord-webhook';
import os from 'os';
import { MapleLandContainer } from './container/maplestoryland';

async function main() {
  process.beep();
  process.release();
  process.time();
  screen.config.highlightDurationMs = 3000;
  mouse.config.autoDelayMs = 200;
  mouse.config.mouseSpeed = 3000;
  keyboard.config.autoDelayMs = 50;

  const asyncTask = new AsyncTask();

  await setup();
  const reactor = new MapleLandContainer();

  const computerUsername = os.userInfo().username.substring(0, 3) + `***`;
  await sendWebhook(`${computerUsername}: Start`, 'Logger');

  try {
    await asyncTask.build(() => reactor.tick(), Infinity).run();
  } catch (error) {
    console.error(error);
    await sendWebhook(`${computerUsername}: ${(error as Error)?.message}`);
  }

  await sleep(5000);
  process.timeEnd();
  process.beep();
  process.exit();
}

main();
