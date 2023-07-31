import { 블스_철봉 } from "./temlpate/blackSmith";
import { 경매장 } from "./temlpate/auction";
import { logger } from "./modules/logger";
import { 합성_철괴 } from "./temlpate/synthesis";
import { screen } from "@nut-tree/nut-js";

async function 철봉_매크로(loop = Infinity) {
  let 반복횟수 = 1;
  let 철봉만든_횟수 = 0;

  await 경매장();

  while (반복횟수 < loop) {
    logger(`(${반복횟수} / ${loop}) 시작`);
    반복횟수 += 1;

    const result = await 블스_철봉();

    if (result === '마감') {
      철봉만든_횟수 += 1;
    }

    if (철봉만든_횟수 === 22) {
      await 경매장();
    }
  }
}

async function 합성_매크로(loop = Infinity) {
  let 반복횟수 = 1;

  while (반복횟수 < loop) {
    logger(`합성 (${반복횟수} / ${loop}) 시작`);
    반복횟수 += 1;

    await 합성_철괴();
  }
}

async function main() {
  process.stderr.write("\x07");

  try {
    await 철봉_매크로();
  } catch (error) {
    console.error(error);
  } finally {
    process.stderr.write("\x07");
  }

}

main();