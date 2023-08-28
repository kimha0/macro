import { Window } from '@nut-tree/nut-js';
import { mouseMove } from './vkey2';

export async function resetMouse(mouseSpeed = 1000) {
  const x = Math.floor(400 + Math.random() * 300);
  const y = Math.floor(300 + Math.random() * 100);
  await mouseMove(x, y, mouseSpeed);
}

export async function resetMouseV2(window: Window, mouseSpeed = 1000) {
  const region = await window.region;

  await mouseMove(region.left, region.top, mouseSpeed);
}
