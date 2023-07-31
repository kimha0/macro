import { sleep, keyboard, Key } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { click } from "../modules/vkey";
import { getRandomPosition, mouseMove } from "../modules/vkey2";
import { findRectangleAreaByCorners } from "../modules/carculator";
import { 아이템창_열기 } from "./inventory";
import { resetMouse } from "../modules/resetMouse";
import { hasImage } from "../modules/hasImage";
import { moveClick } from "../modules/moveClick";
import { logger } from "../modules/logger";

const 블랙스미스_키 = Key.Num4;
const 블랙스미스_클릭횟수 = 6;

async function 철봉도면_선택() {
  const 철봉도면_선택안됨 = await hasImage(
    "./src/assets/blackSmith/도면_아이템리스트.png"
  );

  logger(`철봉 도면 선택여부: ${!철봉도면_선택안됨}`);

  if (철봉도면_선택안됨) {
    await moveClick("./src/assets/blackSmith/도면_아이템리스트.png");
    logger(`철봉 도면 선택`);
  }
}

async function 블스_만들기() {
  // 블랙스미스 스킬창 열기
  await keyboard.pressKey(블랙스미스_키);
  await keyboard.releaseKey(블랙스미스_키);
  await sleep(Math.floor(100 * Math.random()));

  logger("도면을 전부 사용했는지 확인");
  const 도면을_전부_사용했는가 = await hasImage(
    "./src/assets/blackSmith/finished-drawing.png",
    800
  );

  if (도면을_전부_사용했는가) {
    logger("도면을 전부 사용함");
    await 철봉도면_선택();

    await moveClick("./src/assets/blackSmith/cancel.png");

    await 아이템창_열기();

    // 다쓴 도면 이동
    await moveClick("./src/assets/blackSmith/finished-drawing.png", "right");

    await sleep(1000);

    // 버리기
    await resetMouse(4000);
    await sleep(1000);

    await moveClick("./src/assets/blackSmith/discard.png");

    // 새로운 도면 클릭
    await moveClick("./src/assets/blackSmith/drawing-item.png");

    // 비어있는 손에 장착
    await moveClick("./src/assets/blackSmith/empty-right-hand.png");

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
    await hasImage("./src/assets/blackSmith/begin-start.png", 16000);

    const clickPositions = new Array(블랙스미스_클릭횟수).fill(null).map(() => {
      return getRandomPosition(rect);
    });

    for (const pos of clickPositions) {
      await mouseMove(pos.x, pos.y);
      await click(pos, "left");
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

export async function 블스_철봉() {
  await 아이템창_열기();
  const result = await 블스_만들기();
  await sleep(5200);

  return result;
}
