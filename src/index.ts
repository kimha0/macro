import { Key, keyboard, mouse, screen, sleep } from '@nut-tree/nut-js';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { Character } from './resource/maplestory/character';
import { ReactorContainer } from './container/maple/reactor';

async function main() {
  process.beep();
  process.release();
  process.time();
  screen.config.highlightDurationMs = 3000;
  mouse.config.autoDelayMs = 200;
  mouse.config.mouseSpeed = 3000;
  keyboard.config.autoDelayMs = 50;

  const asyncTask = new AsyncTask();

  const reactor = new ReactorContainer(
    new Character('sdfjlkfds', 1, {
      itemInventory: Key.F1,
      jump: Key.D,
      npcAction: Key.PageUp,
      productionSkill: Key.Equal,
    }),
    '10단계 행운의 물약',
  );

  await asyncTask
    .build(async () => {
      await reactor.tick();
      await sleep(300 * 1000);
    }, Infinity)
    .run()
    .catch(console.error)
    .finally(() => {
      process.timeEnd();
      process.beep();
      process.exit();
    });
}

main();
