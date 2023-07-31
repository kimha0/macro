import { screen, loadImage } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";

export async function hasImage(src: string, timeoutMs = 5000) {
  return new Promise<boolean>(async (resolve) => {
    try {
      const image = await screen.waitFor(loadImage(src), timeoutMs);

      if (image) {
        resolve(true);
      }

      resolve(false);
    } catch (error) {
      resolve(false);
    }
  });
}
