import { Key, keyboard } from "@nut-tree/nut-js";
import { msleep } from "sleep";
import { hasImage } from "../modules/hasImage";

const 인벤토리_키 = Key.I;

export async function toggleInventory() {
  await keyboard.pressKey(인벤토리_키);
  await keyboard.releaseKey(인벤토리_키);

  const sleepMs = Math.floor(800 + (100 * Math.random()));

  await msleep(sleepMs);
}

export async function 아이템창_열기() {
  const 아이템창_열림 = await hasImage("./src/assets/items/아이템창_열림.png");

  if (!아이템창_열림) {
    await toggleInventory();
  }
}