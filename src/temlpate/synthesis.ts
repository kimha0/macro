import {
  sleep,
  keyboard,
  Key,
} from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { moveClick } from "../modules/moveClick";

export async function 합성_철괴() {
  await keyboard.pressKey(Key.Num5);
  await keyboard.releaseKey(Key.Num5);

  await moveClick("./src/assets/synthesis/iron-ingot.png");

  await moveClick("./src/assets/synthesis/automatic-materials-button.png");

  await moveClick("./src/assets/synthesis/synthesis-button.png");

  await sleep(Math.floor(3400 + (Math.random() * 200)));

}

