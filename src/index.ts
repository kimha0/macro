import { keyboard, mouse, screen, sleep } from '@nut-tree/nut-js';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { Character } from './resource/maplestory/character';
import { ReactorContainer } from './container/maple/reactor';
import { setup } from './modules/setup';
import { getConfig } from './modules/getConfig';
import { ChangeCharacter } from './actions/maplestory/changeCharacter';
import { Account } from './resource/maplestory/accounts';

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

  const { keybinding, name, order, alchemy } = conf.maplestory.charactor[0];
  const charactor = new Character(name, order, keybinding, alchemy);

  const { twoFactor, useTwoFactor } = conf.maplestory.account;
  const account = new Account(useTwoFactor, twoFactor);

  await new ChangeCharacter(account, charactor).clickCharacter();
  await new ChangeCharacter(account, charactor).checkTwoFactor();

  return;
  // const reactor = new ReactorContainer(charactor, '10단계 행운의 물약');

  // await asyncTask
  //   .build(async () => {
  //     await reactor.tick();
  //     await sleep(300 * 1000);
  //   }, Infinity)
  //   .run()
  //   .catch(console.error)
  //   .finally(() => {
  //     process.timeEnd();
  //     process.beep();
  //     process.exit();
  //   });
}

main();
