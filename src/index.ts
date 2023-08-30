import { keyboard, mouse, screen } from '@nut-tree/nut-js';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { Character } from './resource/maplestory/character';
import { ReactorContainer } from './container/maple/reactor';
import { setup } from './modules/setup';
import { getConfig } from './modules/getConfig';
import { Account } from './resource/maplestory/accounts';
import { sendWebhook } from './modules/discord-webhook';
import os from 'os';

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
  const conf = await getConfig();

  const characters = conf.maplestory.charactor.map(
    ({ name, order, keybinding, fatigue, alchemy }) =>
      new Character(name, order, keybinding, fatigue, alchemy),
  );

  const { twoFactor, useTwoFactor } = conf.maplestory.account;

  const account = new Account(useTwoFactor, twoFactor);
  const reactor = new ReactorContainer(account, characters);

  const computerUsername = os.userInfo().username;
  await sendWebhook(`${computerUsername}: start`);

  let error: null | Error = null;

  await asyncTask
    .build(() => reactor.tick(), Infinity)
    .run()
    .catch(async (err) => {
      console.error(err);
      error = err;
    })
    .finally(async () => {
      await sendWebhook(`${computerUsername}: ${error?.message}`);
      process.timeEnd();
      process.beep();
      process.exit();
    });
}

main();
