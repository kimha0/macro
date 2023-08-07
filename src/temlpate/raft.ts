import { sleep, keyboard, Key, mouse, screen, straightTo, Point, Button } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";
import { 아이템창_열기 } from "./inventory";
import { getImage, hasImage } from "../modules/hasImage";
import { moveClick } from "../modules/moveClick";
import { logger } from "../modules/logger";

const assetsPath = `./src/assets`;

async function 경매장_열기() {
  logger("경매장을 열음");
  await moveClick("./src/assets/auction/open-action.png");
}

async function 내_경매_클릭() {
  logger("내 경매 클릭");
  await moveClick("./src/assets/auction/my-action.png");
}

async function 대금_수령_누르기() {
  logger("대금 수령중");
  await moveClick("./src/assets/auction/all-select.png");
  await moveClick("./src/assets/auction/선택수령.png");
  await moveClick("./src/assets/auction/대금수령.png");

  // 확인 버튼이 늦게 뜸
  await hasImage("./src/assets/auction/확인.png", 2000);
  await moveClick("./src/assets/auction/확인.png");
}

async function 대금_수령_정리() {
  let 처리했는가 = false;
  // 대금 수령 확인 무한루프
  while (true) {
    // 대금 처리 확인 무한루프
    while (true) {
      const 처리중인가 = await hasImage(
        "./src/assets/auction/처리중.png",
        1000
      );

      if (처리중인가) {
        await sleep(1000);
        continue;
      }

      break;
    }

    const 대금_수령이_존재하는가 = await hasImage(
      "./src/assets/auction/collecting-payment.png"
    );
    if (대금_수령이_존재하는가) {
      await 대금_수령_누르기();
      처리했는가 = true;

      continue;
    }

    // const 다음_버튼이_존재하는가 = await hasImage(
    //   "./src/assets/auction/다음버튼.png"
    // );
    // if (다음_버튼이_존재하는가) {
    //   logger("다음버튼 선택");
    //   await moveClick("./src/assets/auction/다음버튼.png", 'left', ({ top, left }) => ({ x: top + 5, y: left + 5 }));

    //   continue;
    // }

    break;
  }

  if (처리했는가) {
    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);

    await sleep(500);
  }

  logger(처리했는가 ? "대금 완료" : "대금 처리 없음");
}

async function 첫등록시_전처리() {
  await mouse.rightClick();
  await sleep(300);
  await mouse.leftClick();
}

async function 아이템_등록하기(isFirstRegister = true, listType: List) {
  logger("아이템 등록을 시작합니다.");

  await moveClick("./src/assets/auction/register-item.png");
  await sleep(500);

  await keyboard.pressKey(Key.LeftAlt);

  if (listType === '철봉') {
    await moveClick("./src/assets/auction/iron-bar.png");
  }

  if (listType === '마포50') {
    await moveClick("./src/assets/auction/마포50.png");
  }

  if (isFirstRegister) {
    await 첫등록시_전처리();
  }

  await keyboard.releaseKey(Key.LeftAlt);
  await sleep(200);

  await moveClick("./src/assets/auction/registerd.png");

  while (true) {
    const 등록에_성공했는가 = await hasImage(
      "./src/assets/auction/경매장등록성공.png",
      1000
    );

    if (!등록에_성공했는가) {
      await sleep(600);
      continue;
    }

    logger("등록 성공!");
    break;
  }
}

async function 아이템_여러개_등록하기(listType: List) {
  let 첫등록인가 = true;
  let 등록개수 = 0;

  while (true) {
    const 경매슬롯_꽉참여부 = await hasImage(
      "./src/assets/auction/full-slot.png"
    );

    if (경매슬롯_꽉참여부) {
      break;
    }

    if (listType === '철봉') {
      const 철봉_여부 = await hasImage("./src/assets/auction/iron-bar.png");

      if (!철봉_여부) {
        break;
      }
    }



    await 아이템_등록하기(첫등록인가, listType);
    등록개수 += 1;
    첫등록인가 = false;
  }

  if (등록개수 === 0) {
    logger("경매장에 아이템을 등록하지 않음");

    return;
  }

  logger(`총 ${등록개수}개 등록`);
}

async function 경매장닫기() {
  while (true) {
    const 경매장_닫기_버튼여부 = await hasImage(
      "./src/assets/auction/경매장닫기.png"
    );

    if (!경매장_닫기_버튼여부) {
      break;
    }

    await moveClick("./src/assets/auction/경매장닫기.png");
    await sleep(500);
  }
}

type List = '철봉' | '마포50'
async function 물뜨기() {
  await keyboard.pressKey(Key.E);
  await mouse.leftClick();
  await keyboard.releaseKey(Key.E);
}

async function isEmptyLeftHand() {
  return await getImage(`${assetsPath}/bottle/empty-left-hand.png`)
}

async function changeBottle() {
  const emptyRegion = await isEmptyLeftHand();

  if (emptyRegion != null) {
    const bottleRegion = await getImage(`${assetsPath}/bottle/bottle.png`)

    if (bottleRegion == null) {
      throw new Error('병 찾을 수 없음');
    }

    await keyboard.pressKey(Key.LeftControl);
    await moveClick(bottleRegion, 'right');
    await keyboard.releaseKey(Key.LeftControl);
  }
}

async function 미라지_장전여부() {
  const imageRegion = await hasImage(`${assetsPath}/raft/skill.png`, 1000);

  return imageRegion;
}

async function 미라지_장전() {
  const isSkillCharged = await 미라지_장전여부();

  if (!isSkillCharged) {
    await keyboard.pressKey(Key.Num1);
    await keyboard.releaseKey(Key.Num1);
  
  }

  return isSkillCharged
}

async function 공격() {
  await keyboard.pressKey(Key.LeftControl);

  await mouse.click(Button.LEFT);
  await sleep(50);
  await mouse.click(Button.LEFT);
  await keyboard.releaseKey(Key.LeftControl);
}

async function 마나회복(currentMana: number) {
  if (currentMana < 50) {
    await keyboard.pressKey(Key.Num4);
    await keyboard.releaseKey(Key.Num4);

    return currentMana + 300;
  }

  return currentMana;
}

export async function 뗏목(cnt = Infinity, bottleChangeCount = 80) {
  let 현재마나 = 350;

  while(true) {
    const 장전여부 = await 미라지_장전();
    await 공격();

    if (장전여부) {
      현재마나 -= 15;  
    }

    현재마나 = await 마나회복(현재마나);
  }
  // let count = 0;

  // while(count < cnt) {
  //   await 물뜨기();
  //   await sleep(2500);

  //   count += 1;

  //   if (count !== 0 && count % bottleChangeCount === 0) {
  //     await moveClick(`${assetsPath}/bottle/아이템모으기.png`);
  //     const height = await screen.height();
  //     const width = await screen.width();
  //     await mouse.move(straightTo(new Point(width / 2, height / 2)))
  //   }
  // }
}
