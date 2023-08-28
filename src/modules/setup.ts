import { Window, getActiveWindow, getWindows, sleep } from '@nut-tree/nut-js';
import { logger } from './logger';

export async function setup() {
  const windows = await getWindows();

  let maplestoryWindow: Window | null = null;
  for await (const window of windows) {
    const title = await window.title;

    if (title.includes(`MapleStory`)) {
      maplestoryWindow = window;
    }
  }

  if (maplestoryWindow == null) {
    throw new Error(`please run MapleStory`);
  }

  logger(`Waiting for the MapleStory window to be activated.`);

  while (true) {
    const activeWindow = await getActiveWindow();

    const title = await activeWindow.title;

    if (title.includes(`MapleStory`)) {
      logger(`Found an active MapleStory.`);
      break;
    }

    await sleep(1000);
  }
}
