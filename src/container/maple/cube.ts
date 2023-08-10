import { Button, Key, keyboard, mouse, Point, randomPointIn, Region, sleep, straightTo } from "@nut-tree/nut-js";
import { getImage } from "../../modules/hasImage";
import { mapleStoryInventorySingleton } from "./inventory";
import { getText } from "../../modules/ocr";
import { emptyStringReplace } from "../../modules/text";

interface Option {
  type: 'str' | 'int' | 'luk' | 'dex' | '공격력' | '마력' | '올스텟';
  percent: 3 | 6
}

interface Result {
  str: number,
  dex: number,
  int: number,
  luk: number,
  공격력: number,
  마력: number,
};

export class MapleCube {
  private resourcePath = `src/assets/maple/cube`;
  private currentPosX = 0;
  private currentPosY = 0;

  private itemSearchX = 8;
  private itemSearchY = 8;

  private currentItemPos: Region | null = null;

  private inventory = mapleStoryInventorySingleton;
  private needRetrySearch = true;
  constructor(public key: Key = Key.I, public sleepMs = 350) { }

  private async findItems() {
    await this.inventory.open();
    await this.inventory.moveTab('장비');
    await sleep(1000);

    const region = await this.inventory.getItemRegion();

    for (let y = this.currentPosY; y < this.itemSearchY; ++y) {
      for (let x = this.currentPosX; x < this.itemSearchX; ++x) {
        const currentItem = region[this.currentPosY][this.currentPosX];

        if (currentItem != null) {

          this.currentItemPos = new Region(currentItem.left + 2, currentItem.top + 2, currentItem.width - 8, currentItem.height - 8);

          return;
        }
      }
    }

    throw new Error('아이템을 찾을 수 없음');
  }

  private async parseCubeText() {
    let region: Region | null = null;

    while(true) {
      const r = (await getImage(`src/assets/maple/cube/cube-top.png`))

      if (r != null) {
        region = r;
        break;
      }
    }

    const { left, top } = region;
    const config = { lang: 'kor+eng', psm: 6 };

    const grade = emptyStringReplace(await getText(new Region(left + 50, top + 144, 75, 14), config));

    const first = await this.parseOption(new Region(left + 2, top + 160, 173, 14));
    const second = await this.parseOption(new Region(left + 2, top + 174, 173, 14));
    const third = await this.parseOption(new Region(left + 2, top + 188, 173, 14));

    const result = [first, second, third].reduce<Result>((accu, curr) => {
      if (curr == null) {
        return accu;
      }

      const ac = accu as Result;

      if (curr.type === '올스텟') {
        return {
          ...ac,
          str: ac.str + 3,
          int: ac.int + 3,
          luk: ac.luk + 3,
          dex: ac.dex + 3,
        }

      }

      return {
        ...ac,
        [curr.type]: curr.percent + ac[curr.type],
      }
    }, {
      str: 0,
      dex: 0,
      int: 0,
      luk: 0,
      공격력: 0,
      마력: 0,
    })

    return {
      grade: this.parseGrade(grade),
      result: { ...result },
    }
  }

  private parseGrade(grade: string) {
    if (grade.includes('메픽') || grade.includes('에픽')) {
      return 'epic' as const;
    }

    if (grade.includes('레머') || grade.includes('레어')) {
      return 'rare' as const;
    }

    return 'unsupport' as const;
  }

  private async parseOption(searchRegion: Region): Promise<Option | null> {
    const paths = ['dex3', 'dex6', 'int3', 'int6', 'luk3', 'luk6', 'str3', 'str6', '공격력3', '공격력6', '마력3', '마력6', '올스텟3'];

    let option: string | null = null;

    for await (const path of paths) {
      const region = await getImage(`src/assets/maple/cube/${path}.png`, { searchRegion });

      if (region != null) {
        option = path;

        break;
      }
    }

    if (option == null) {
      return null;
    }

    const match = option.match(/(\D+)(\d+)/)!;

    const type = match[1] as Option['type'];
    const percent = parseInt(match[2], 10) as Option['percent'];

    return {
      type,
      percent,
    }
  }

  private async isValidOptions() {
    const { grade, result } = await this.parseCubeText();

    if (grade === 'rare') {
      return false;
    }

    const values = Object.values(result);

    for (const value of values) {
      if (value >= 9) {
        return true;
      }
    }

    return false;
  }

  public async openCube() {
    await this.inventory.open();
    await this.inventory.moveTab('소비');


    const region = await getImage(`${this.resourcePath}/cube-item.png`);
    if (region == null) { throw new Error('수상한 큐브가 존재하지 않습니다.'); }

    const cubeRegion = new Region(region.left, region.top, region.width, 30);

    await mouse.move(straightTo(randomPointIn(cubeRegion)));
    await mouse.doubleClick(Button.LEFT);

    await sleep(500);


    if (this.currentItemPos == null) {
      throw new Error('큐브를 돌릴 아이템을 찾을 수 없습니다.');
    }

    await mouse.move(straightTo(randomPointIn(this.currentItemPos)));
    await mouse.leftClick();

    await this.pressEnter();
    await this.pressEnter();
    await this.pressEnter();
  }

  private updatePos() {
    if (this.currentPosX < this.itemSearchX) {
      this.currentPosX += 1;

      return;
    }

    this.currentPosX = 0;
    this.currentPosY += 1;
  }

  private async retry() {
    if (this.needRetrySearch) {
      const retryRegion = await getImage(`${this.resourcePath}/retry.png`);
      if (retryRegion == null) { throw new Error('한번 더 사용하기 버튼을 찾을 수 없습니다.'); }
      await mouse.move(straightTo(randomPointIn(retryRegion)));
    }
    await mouse.leftClick();
    await sleep(200);
    await this.pressEnter();
    await this.pressEnter();
    await this.pressEnter();

    this.needRetrySearch = false;
  }

  private async pressEnter() {
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);
  }

  public async release() {
  await this.findItems();
  await sleep(200);

  await this.openCube();
  this.needRetrySearch = true;

  while (true) {
    const isValid = await this.isValidOptions();

    if (isValid) {
      await mouse.move(straightTo(new Point(0, 0)));
      const confirmRegion = await getImage(`${this.resourcePath}/confirm2.png`);
      if (confirmRegion == null) { throw new Error('확인 버튼을 찾을 수 없습니다.'); }
      await mouse.move(straightTo(randomPointIn(confirmRegion)));
      await mouse.doubleClick(Button.LEFT);
      await sleep(350);

      await this.updatePos();
      break;
    }

    await this.retry();
  }
}
}

export const mapleStoryCubeSingleton = new MapleCube(Key.I, 350);
