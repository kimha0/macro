import { 블스_봉만들기 } from "./temlpate/blackSmith";
import { 경매장 } from "./temlpate/auction";
import { logger } from "./modules/logger";
import { 합성 } from "./temlpate/synthesis";
import { Point, Region, getActiveWindow, getWindows, keyboard, mouse, randomPointIn, screen, sleep, straightTo } from "@nut-tree/nut-js";
import { getText, 메이플_아이템_좌표얻기, 메이플_아이템창_열기, 메이플_아이템창_좌표_얻기, 메이플_아이템창_탭_이동 } from "./temlpate/maple/openInventory";
import { moveClick } from "./modules/moveClick";
import { 물 } from "./temlpate/bottle";
import { 뗏목 } from "./temlpate/raft";
import { AuctionV2 } from "./temlpate/auction-bar";

function getRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function 블스_매크로(경매장활성여부 = false, 경매장_오픈횟수 = 10, loop = Infinity) {
  let 반복횟수 = 1;
  let 철봉만든_횟수 = 0;
  let 경매장_오픈여부 = false;

  let randomNumber = getRandomNumberInRange(80, 100);

  // await 경매장('철봉');

  while (반복횟수 < loop) {
    console.time('철봉');
    logger(`(${반복횟수} / ${loop}) 시작`);
    반복횟수 += 1;

    const result = await 블스_봉만들기('미금은');

    if (result === '마감') {
      철봉만든_횟수 += 1;
      경매장_오픈여부 = (철봉만든_횟수 % 경매장_오픈횟수) === 0
    }

    if (경매장활성여부 && 경매장_오픈여부) {
      await 경매장('철봉');
      경매장_오픈여부 = false;
    }

    logger(`${철봉만든_횟수}개 생산`)
    console.timeEnd('철봉');
    console.log('\n');

    if (randomNumber === loop) {
      // 정지를 피하기 위해 잠시 휴식
      randomNumber += getRandomNumberInRange(80, 100);
      const breakTimeMinute = getRandomNumberInRange(5, 7);

      logger(`${breakTimeMinute}분 휴식합니다.`);
      await sleep(breakTimeMinute * 1_000);
    }
  }
}

async function 합성_매크로(loop = Infinity, type: Parameters<typeof 합성>[0]) {
  let 반복횟수 = 0;

  while (반복횟수 < loop) {
    logger(`합성 (${반복횟수 + 1} / ${loop}) 시작`);
    반복횟수 += 1;

    await 합성(type);
  }
}

async function main() {
  process.stderr.write("\x07");
  console.time('start')
  screen.config.highlightDurationMs = 3000;
  // keyboard.config.autoDelayMs = 800;
  mouse.config.autoDelayMs = 200;

  try {
    // await 메이플_아이템창_열기();
    // await 메이플_아이템창_탭_이동('장비');
    // // await 메이플_아이템창_좌표_얻기();
    // const maps = await 메이플_아이템_좌표얻기();

    // const activeWindow = await getActiveWindow();
    // const windowRegion = await activeWindow.region;

    // for await (const y of maps) {
    //   for await (const x of y) {
    //     if (x != null) {
    //       await mouse.move(straightTo(randomPointIn(x)));

    //       await screen.highlight(new Region(x.left, windowRegion.top + 32, 280, 768));
    //       const txt = await getText({ x: x.left, y: windowRegion.top + 32, height: 768, width: 280 });
    //       console.log(txt);

    //       break;
    //     }
    //   }
    // }
    // await 물(Infinity);

    // await 뗏목();
    // await 합성_매크로(20, '은괴');
    // await 합성_매크로(50, '금괴');
    // await 합성_매크로(50, '미스릴괴');
    // await 블스_매크로(false, 10);

    while (true) {
      await AuctionV2();
    }
  } catch (error) {
    console.error(error);
  } finally {

    // try {
    //   while (true) {
        // await 경매장('철봉');
    //     await sleep(10000)
    //   }
    // } catch (error) {
    //   console.timeEnd('start')

    //   process.stderr.write("\x07");
    // }

    console.timeEnd('start')

    process.stderr.write("\x07");
  }

}

main();