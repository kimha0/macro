import { loadImage as nutLoadImage, Image } from '@nut-tree/nut-js';
import { logger } from './logger';

const cache: Record<string, Image> = {};

export async function loadImage(...args: Parameters<typeof nutLoadImage>) {
  const cacheKey = args[0];

  if (cache[cacheKey] != null) {
    return cache[cacheKey];
  }

  const image = await nutLoadImage(...args);

  cache[cacheKey] = image;

  return image;
}