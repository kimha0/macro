import { Key, Region, getActiveWindow, keyboard } from '@nut-tree/nut-js';
import { MapleResource } from '../../constants/maplestory';
import { getImage, hasImage } from '../../modules/hasImage';
import { Character } from '../../resource/maplestory/character';
import { moveClick } from '../../modules/moveClick';
import { Account } from '../../resource/maplestory/accounts';
import { resetMouseV2 } from '../../modules/resetMouse';
import { logger } from '../../modules/logger';

export class ChangeCharacter {
  constructor(
    public account: Account,
    public character: Character,
  ) {}

  public async waitLoginScreen() {
    await hasImage(MapleResource.로그인_이전으로, 10000);
  }

  public async clickCharacter() {
    const window = await getActiveWindow();
    const region = await window.region;

    const xOrder = this.character.order % 6;
    const xPos = region.left + 121 + xOrder * 125;

    const yOrder = Math.floor(this.character.order / 6);
    const yPos = region.top + 315 + yOrder * 220;

    await moveClick(new Region(xPos, yPos, 35, 60));
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await resetMouseV2(window);
  }

  public async checkTwoFactor() {
    if (!this.account.useTwoFactor) {
      return;
    }

    const window = await getActiveWindow();
    const region = await window.region;

    const image = await hasImage(MapleResource.이차비번_변경버튼, undefined, {
      searchRegion: region,
    });

    if (image == null) {
      throw new Error('2차 비밀번호 재설정 버튼을 찾을 수 없습니다.');
    }

    if (
      this.account.twoFactorPassword !==
      this.account.twoFactorPassword.toLowerCase()
    ) {
      throw new Error('2차 비밀번호에 대문자가 들어간 경우 지원하지 않음.');
    }

    const regions: Region[] = [];

    await resetMouseV2(window);

    for await (const char of this.account.twoFactorPassword) {
      const region = await getImage(
        `${MapleResource.비번_이미지_경로}/${char}.png`,
      );

      if (region == null) {
        throw new Error(`2차 비밀번호 버튼을 찾을 수 없습니다. ${char}`);
      }

      regions.push(region);
    }

    for await (const region of regions) {
      await moveClick(region, 'left', undefined, region);
    }

    logger('2차 비밀번호 입력 완료');

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    const 접속완료여부 = await hasImage(MapleResource.캐시샵_버튼, 10000, {
      searchRegion: region,
    });

    if (!접속완료여부) {
      throw new Error('로그인 실패');
    }
  }

  public async clearScreen() {
    return new Promise(async (resolve) => {
      while (true) {
        const 설정_액티브 = await hasImage(MapleResource.설정_액티브상태, 1000);

        if (설정_액티브) {
          await keyboard.pressKey(Key.Escape);
          await keyboard.releaseKey(Key.Escape);
          resolve(true);

          break;
        }

        await keyboard.pressKey(Key.Escape);
        await keyboard.releaseKey(Key.Escape);
      }
    });
  }
}
