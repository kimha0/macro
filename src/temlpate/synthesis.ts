import {
  sleep,
  keyboard,
  Key,
} from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { moveClick } from "../modules/moveClick";

type Material = '철괴' | '마나50' | '은괴' | '미스릴괴' | '금괴';

export async function 합성(material: Material) {
  await keyboard.pressKey(Key.Num5);
  await keyboard.releaseKey(Key.Num5);

 console.log(material);
  switch (material) {
    case '철괴': {
      await moveClick("./src/assets/synthesis/iron-ingot.png");
      break;
    }
    case '마나50': {
      await moveClick("./src/assets/synthesis/마나50.png");
      break;
    }
    case '은괴': {
      await moveClick("./src/assets/synthesis/은괴.png");
      break;
    }
    case '미스릴괴': {
      await moveClick("./src/assets/synthesis/미스릴괴.png");
      break;
    }
    case '금괴': {
      await moveClick("./src/assets/synthesis/금괴.png");
      break;
    }
  }

  await moveClick("./src/assets/synthesis/automatic-materials-button.png");

  await moveClick("./src/assets/synthesis/synthesis-button.png");

  await sleep(Math.floor(3400 + (Math.random() * 200)));

}

