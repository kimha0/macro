import { Region, screen } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { loadImage } from "./loadImage";

export async function findRectangleAreaByCorners(좌측상단: string | Region, 우측하단: string | Region) {

  const [leftTop, rightBottom] = await Promise.all([
    typeof 좌측상단 === 'string' ? screen.waitFor(loadImage(좌측상단), 5000, 100) : 좌측상단,
    typeof 우측하단 === 'string' ? screen.waitFor(loadImage(우측하단), 5000, 100) : 우측하단,
  ]);

  const x1 = leftTop.left;
  const y1 = leftTop.top;

  const x2 = rightBottom.left + rightBottom.width;
  const y2 = rightBottom.top + rightBottom.height;

  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  return { width, height, left: x1, top: y1 };
}