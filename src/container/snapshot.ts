import { Region, screen } from "@nut-tree/nut-js";
import { getImage } from "../modules/hasImage";
import { getText } from "../modules/ocr";

export class Snapshot {
  static async highlight(src: string | { left: number; top: number; width: number; height: number }) {

    const region = typeof src === 'string' ?
      await getImage(src) :
      new Region(src.left, src.top, src.width, src.height);

    if (region == null) {
      throw new Error(`이미지를 찾을 수 없음. ${src}`)
    }

    console.log(region);
    const txt = await getText(region);
    console.log(txt);
    await screen.highlight(region!);
  }
}