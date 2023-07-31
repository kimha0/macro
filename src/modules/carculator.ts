import { screen, loadImage } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";

export async function findRectangleAreaByCorners(좌측상단: string, 우측하단: string) {
  const [leftTop, rightBottom] = await Promise.all([
    screen.waitFor(loadImage(좌측상단)),
    screen.waitFor(loadImage(우측하단)),
  ]);

  const x1 = leftTop.left;
  const y1 = leftTop.top;

  const x2 = rightBottom.left + rightBottom.height;
  const y2 = rightBottom.top + rightBottom.width;

  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  return { width, height, left: x1, top: y1 };
}