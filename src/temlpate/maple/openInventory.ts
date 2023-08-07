import { keyboard, Key, screen, Region, Image, windowWithTitle } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { getImage } from "../../modules/hasImage";
import { logger } from "../../modules/logger";
import { moveClick } from "../../modules/moveClick";
import { findRectangleAreaByCorners } from "../../modules/carculator";
import { loadImage } from "../../modules/loadImage";

import tesseract from "node-tesseract-ocr"
import { Screenshots } from "node-screenshots";

const ITEM_KEY = Key.I;
const resourcePath = `./src/assets/maple/item` as const;

export async function 메이플_아이템창_열기(key = ITEM_KEY) {
  const 메소_버튼이_존재하는가 = await getImage(`${resourcePath}/메소버튼.png`);

  if (메소_버튼이_존재하는가 != null) {
    return;
  }

  await keyboard.pressKey(key);
  await keyboard.releaseKey(key);

  logger('아이템 창 열음');

  return;
}


type MapleItemTab = '장비' | '소비' | '기타';

async function getMaplestoryItemTebImage(tab: MapleItemTab) {
  return getImage(`${resourcePath}/${tab}.png`);
}
export async function 메이플_아이템창_탭_이동(tab: MapleItemTab) {
  const tabImage = await getMaplestoryItemTebImage(tab);

  if (tabImage == null) {
    return;
  }

  await moveClick(tabImage);

  return;
}

export async function 메이플_아이템창_좌표_얻기() {
  const leftTop = await getImage(`${resourcePath}/left-top.png`);
  const rightBottom = await getImage(`${resourcePath}/right-bottom.png`);

  if (leftTop == null || rightBottom == null) {
    throw Error('아이템 창 좌표를 가져오지 못함.');
  }

  const { height, left, top, width } = await findRectangleAreaByCorners(leftTop, rightBottom);

  const region = new Region(left, top + 21, width + 85, height - 45)

  return region;
}

export async function 메이플_아이템_좌표얻기() {
  const { left, top } = await 메이플_아이템창_좌표_얻기();
  const firstOffset = { top: 9, left: 6 };
  const itemsOffset = { top: 9, left: 9 };
  const rectSize = 33;

  const itemSize = { x: 16, y: 8 };


  const maps: (Region | null)[][] = []

  for (let y = 0; y < itemSize.y; ++y) {
    if (maps[y] == null) {
      maps[y] = [];
    }

    for (let x = 0; x < itemSize.x; ++x) {
      
      const l = left + firstOffset.left + (x * (itemsOffset.left + rectSize));
      const t = top + firstOffset.top + (y * (itemsOffset.top + rectSize));

      const region = new Region(l, t, rectSize, rectSize);

      const image = await loadImage(`${resourcePath}/못쓰는_아이템창.png`);
      const result = await getImage(image, { searchRegion: region });

      if (result != null) {
        maps[y][x] = null;
      } else {
        maps[y][x] = region;
      }
    }
  }

  return maps;
}

interface CaptureOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}


const screenshots = Screenshots.fromPoint(0, 0);

export async function getText(options: CaptureOptions) {
  const config = {
    lang: "kor+eng", // default
    oem: 3,
    psm: 12,
  }

  const buffer = await screenshots!.captureArea(options.x, options.y, options.width, options.height)

  return tesseract.recognize(buffer, config);
}

export async function hasText(containString: string, options: CaptureOptions) {
  const text = await getText(options);

  return text.includes(containString);
}
