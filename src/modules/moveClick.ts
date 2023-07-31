import { screen, loadImage } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { click } from "../modules/vkey";
import {
  getRandomPosition,
  mouseMove,
} from "../modules/vkey2";
import { logger } from "./logger";

export async function moveClick(src: string, distance: "left" | "right" = "left") {
  try {
    const image = await screen.waitFor(loadImage(src));
    const position = getRandomPosition(image);
  
    await mouseMove(position.x, position.y);
    await click(position, distance);
  } catch (error) {
    logger(`src: ${src}`)
    console.error(error);

    throw error;
  }
  
}