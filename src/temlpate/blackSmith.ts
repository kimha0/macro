import { sleep, keyboard, Key, screen, mouse, straightTo, Point, Region } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { click } from "../modules/vkey";
import { getRandomPosition, mouseMove } from "../modules/vkey2";
import { findRectangleAreaByCorners } from "../modules/carculator";
import { 아이템창_열기 } from "./inventory";
import { resetMouse } from "../modules/resetMouse";
import { getImage, hasImage } from "../modules/hasImage";
import { moveClick } from "../modules/moveClick";
import { logger } from "../modules/logger";
import { getClickDelay } from "../modules/delay";
import { loadImage } from "../modules/loadImage";


const 블랙스미스_키 = Key.Num4;
const blackSmithPath = `./src/assets/blackSmith`;

type Type = '철봉' | '미스릴봉' | '금봉' | '은봉' | '미금은';

async function 도면_즐겨찾기_선택() {
  const 철봉도면_선택됨 = await hasImage(
    `${blackSmithPath}/도면_리스트.png`
  );

  logger(`도면 즐겨찾기 선택여부: ${철봉도면_선택됨}`);

  if (!철봉도면_선택됨) {
    await moveClick(`${blackSmithPath}/미선택_도면_리스트.png`);
    logger(`도면 즐겨찾기 선택`);
  }
}

async function 블스_만들기(type: Type) {
  // 블랙스미스 스킬창 열기
  await keyboard.pressKey(블랙스미스_키);
  await keyboard.releaseKey(블랙스미스_키);
  await sleep(Math.floor(100 * Math.random()));

  logger("도면을 전부 사용했는지 확인");
  const 도면을_전부_사용했는가 = await hasImage(
    `${blackSmithPath}/finished-drawing.png`,
    800
  );

  if (도면을_전부_사용했는가) {
    logger("도면을 전부 사용함");
    
    await moveClick(`${blackSmithPath}/cancel.png`);   
    await 아이템창_열기();

    await keyboard.pressKey(Key.I);
    await keyboard.releaseKey(Key.I);
    await sleep(1000);

    await keyboard.pressKey(Key.I);
    await keyboard.releaseKey(Key.I);
    await sleep(1000);

    await 도면_즐겨찾기_선택();

    // 다쓴 도면 이동
    const rightHandRegion = await getImage(`${blackSmithPath}/finished-drawing.png`);
    if (rightHandRegion == null) {
      throw new Error('다 쓴 도면 찾기 실패함');
    }

    await moveClick(rightHandRegion, "right");

    await sleep(1000);

    // // 버리기
    await resetMouse(4000);
    await sleep(1000);
    await moveClick(`${blackSmithPath}/discard.png`);

    // 새로운 도면 클릭
    let drawingItemRegion: Region | null = null;
    if (type !== '미금은') {
      drawingItemRegion = await getImage(`${blackSmithPath}/drawing-item-${type}.png`);  
    }

    if (type === '미금은') {
      drawingItemRegion = await getImage(`${blackSmithPath}/drawing-item-미스릴봉.png`);
      
      if (drawingItemRegion == null) {
        drawingItemRegion = await getImage(`${blackSmithPath}/drawing-item-금봉.png`);
      }

      if (drawingItemRegion == null) {
        drawingItemRegion = await getImage(`${blackSmithPath}/drawing-item-은봉.png`);
      }
    }

    if (drawingItemRegion == null) {
      throw new Error("도면 찾기 실패");
    }

    await mouse.move(straightTo(new Point(drawingItemRegion.left - 38, drawingItemRegion.top)));
    await keyboard.pressKey(Key.LeftControl);
    await mouse.leftClick();
    await keyboard.releaseKey(Key.LeftControl);
    await sleep(1500);

    // 비어있는 손에 장착. TODO: 인식률이 너무 낮아서 절대좌표로 함
    // await moveClick(rightHandRegion);

    await sleep(1500);

    await keyboard.pressKey(블랙스미스_키);
    await keyboard.releaseKey(블랙스미스_키);
    await sleep(Math.floor(100 * Math.random()));

    return "도면" as const;
  }

  logger("제작인지, 마감인지 확인");
  const 제작인가 = await hasImage("./src/assets/blackSmith/need-ingot.png");

  if (!제작인가) {
    logger("마감 시작");
    await resetMouse();
    await moveClick("./src/assets/blackSmith/start-button.png");

    const rect = await findRectangleAreaByCorners(
      "./src/assets/blackSmith/left-up.png",
      "./src/assets/blackSmith/right-down.png"
    );

    // 마감점 멈춘 경우 시작
    const pos = await getRandomPosition(rect);
    await mouseMove(pos.x, pos.y);

    await hasImage("./src/assets/blackSmith/begin-start.png", 10000);

    let 클릭_수 = 0;
    while (클릭_수 < 9) {
      try {
        await screen.find(loadImage('./src/assets/blackSmith/complete.png'));

        logger('마감점 마무리');

        await click(pos, "left");
        await sleep(getClickDelay());

      } catch {
        logger('마감점 클릭');

        await click(pos, "left");
        await sleep(getClickDelay());

        클릭_수 += 1;
        continue;
      }

      break;
    }

    return "마감" as const;
  }

  if (제작인가) {
    logger("제작 시작");
    await moveClick("./src/assets/blackSmith/automatic-materials-button.png");

    await moveClick("./src/assets/blackSmith/start-button.png");

    return "제작" as const;
  }

  throw new Error("제작, 마감, 도면 변경이 아님");
}

export async function 블스_봉만들기(type: Type) {
  await 아이템창_열기();
  const result = await 블스_만들기(type);
  await sleep(5200);

  return result;
}
