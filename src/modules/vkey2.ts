import {
  mouse,
  straightTo,
  Point,
  sleep,
} from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";

export function getRandomizorPosition(width: number, height: number) {
  const randomValue = Math.random() < 0.5 ? -1 : 1;

  return {
    x: ((width / 2.4) * Math.random()) * randomValue,
    y: ((height / 2.4) * Math.random()) * randomValue,
  };
}

interface Area {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function getPosition({ left, top, width, height }: Area) {
  return {
    x: Math.floor(left + width / 2),
    y: Math.floor(top + height / 2),
  };
}


export function getRandomPosition({ left, top, width, height }: Area) {
  const { x, y } = getRandomizorPosition(width, height)

  return {
    x: Math.floor(left + width / 2 + x),
    y: Math.floor(top + height / 2 + y),
  };
}

export async function mouseMove(x: number, y: number, mouseSpeed = 2000) {
  const distance = Math.floor(Math.random() * 6) + 10;
  const distance2 = Math.floor(Math.random() * mouseSpeed) + (mouseSpeed + 100);

  const randomMouseSpeed = distance + distance2;

  mouse.config.mouseSpeed = randomMouseSpeed;
  await mouse.move(straightTo(new Point(x, y)));

  await sleep(Math.floor(Math.random() * 600) + 200);
}