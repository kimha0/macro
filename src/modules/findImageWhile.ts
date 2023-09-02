import { Region } from '@nut-tree/nut-js';
import { getImage } from './hasImage';

export async function findImageWhile(src: string, loop = 5) {
  let i = 0;

  return new Promise<Region>(async (resolve, reject) => {
    while (i < loop) {
      const image = await getImage(src);

      if (image != null) {
        resolve(image);
        break;
      }

      i++;
    }
    reject(new Error(`not found ${src}`));
  });
}
