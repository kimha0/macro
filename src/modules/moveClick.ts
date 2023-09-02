import { screen, Region, randomPointIn, sleep } from '@nut-tree/nut-js';
import '@nut-tree/template-matcher';
import { click } from '../modules/vkey';
import { mouseMove } from '../modules/vkey2';
import { logger } from './logger';
import { loadImage } from './loadImage';

type Positon = { x: number; y: number };

type SrcType = string | Promise<Region> | Region;

async function getImage(src: SrcType, searchRegion?: Region) {
  if (typeof src === 'string') {
    return screen.waitFor(loadImage(src), 5000, 100, { searchRegion });
  }

  return await src;
}

export async function moveClick(
  src: SrcType,
  distance: 'left' | 'right' = 'left',
  pos?: (image: Region) => Positon,
  region?: Region,
) {
  try {
    const image = await getImage(src, region);
    const position = pos?.(image) ?? (await randomPointIn(image));

    await mouseMove(position.x, position.y);
    await sleep(300);
    await click(position, distance);
  } catch (error) {
    logger(`src: ${src}`);
    console.error(error);

    throw error;
  }
}
