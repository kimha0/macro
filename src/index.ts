import { keyboard, mouse, screen } from '@nut-tree/nut-js';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { Character } from './resource/maplestory/character';
import { ReactorContainer } from './container/maple/reactor';
import { setup } from './modules/setup';
import { getConfig } from './modules/getConfig';
import { Account } from './resource/maplestory/accounts';
import { Reactor } from './actions/maplestory/reactor';

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

  await asyncTask
    .build(() => reactor.tick(), Infinity)
    .run()
    .catch(console.error)
    .finally(() => {
      process.timeEnd();
      process.beep();
      process.exit();
    });
}

main();
