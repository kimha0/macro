import {
  Image,
  OptionalSearchParameters,
  Region,
  screen,
} from '@nut-tree/nut-js';
import '@nut-tree/template-matcher';
import { loadImage } from './loadImage';

export async function hasImage(
  src: string,
  timeoutMs = 3000,
  params?: OptionalSearchParameters<undefined>,
) {
  return new Promise<boolean>(async (resolve) => {
    try {
      const image = await screen.waitFor(
        loadImage(src),
        timeoutMs,
        100,
        params,
      );

      if (image) {
        resolve(true);
      }

      resolve(false);
    } catch (error) {
      resolve(false);
    }
  });
}

export async function getImage(
  source: string | Image,
  config?: Parameters<typeof screen.find>[1],
) {
  return new Promise<Region | null>(async (resolve) => {
    try {
      const isString = typeof source === 'string';
      const image = await screen.find(
        isString ? loadImage(source) : source,
        config,
      );

      if (image) {
        resolve(image);
      }

      resolve(null);
    } catch (error) {
      resolve(null);
    }
  });
}
