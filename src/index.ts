import { keyboard, mouse, screen } from '@nut-tree/nut-js';
import { processSingleton as process } from './container/process';
import { AsyncTask } from './container/asyncTask';
import { MapleCube } from './container/maple/cube';

async function main() {
  process.beep();
  process.release();
  process.time();
  screen.config.highlightDurationMs = 3000;
  mouse.config.autoDelayMs = 200;
  mouse.config.mouseSpeed = 3000;
  keyboard.config.autoDelayMs = 50;

  const mapleCube = new MapleCube({
    attackType: '공격력',
    level: '30~70',
    weapon: '무기/보장',
  });
  // const mapleCube = new MapleCube({ attackType: '마력', level: '71~', weapon: '방어구' });
  const asyncTask = new AsyncTask();

  await asyncTask
    .build(() => mapleCube.release(), 32)
    .run()
    .catch(console.error)
    .finally(() => {
      process.timeEnd();
      process.beep();
      process.exit();
    });
}

main();
