import {
  Button,
  Key,
  Region,
  clipboard,
  getActiveWindow,
  keyboard,
  mouse,
  randomPointIn,
  sleep,
  straightTo,
} from '@nut-tree/nut-js';
import { MapleResource } from '../../constants/maplestory';
import { getImage, hasImage } from '../../modules/hasImage';
import { Character } from '../../resource/maplestory/character';
import { moveClick } from '../../modules/moveClick';
import { Channel } from './channel';
import { resetMouseV2 } from '../../modules/resetMouse';
import { getConfig } from '../../modules/getConfig';
import { findImageWhile } from '../../modules/findImageWhile';
import { Snapshot } from '../../container/snapshot';

export class Reactor {
  public channel: Channel;
  public config = getConfig();

  constructor(
    public character: Character,
    delay = 5000,
  ) {
    this.channel = new Channel(delay);
  }

  public async waitArdentmill() {
    return new Promise(async (resolve, reject) => {
      let i = 0;

      while (i < 5) {
        const isArdentmill = await hasImage(MapleResource.전문기술마을_미니맵);

        if (isArdentmill) {
          resolve(true);
          break;
        }

        ++i;
      }

      reject(false);
    });
  }

  public async goToArdentmill() {
    await this.waitArdentmill();

    const goToArdentmill = (await this.config).maplestory.goToArdentmill;

    if (!goToArdentmill) {
      return;
    }

    await keyboard.pressKey(this.character.keybinding.productionSkill);
    await keyboard.releaseKey(this.character.keybinding.productionSkill);

    const 전문기술마을_가기_버튼 = await findImageWhile(
      MapleResource.전문기술마을_가기_버튼,
    );

    if (전문기술마을_가기_버튼 == null) {
      throw new Error(`전문기술마을로 가는 버튼을 찾을 수 없습니다.`);
    }

    await moveClick(전문기술마을_가기_버튼);
    await sleep(1000);

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await hasImage(MapleResource.전문기술마을_미니맵, 5000);

    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);
  }

  public async goToTheAlchemyPlace() {
    await this.goToArdentmill();

    await this.channel.changeNextChennel();
    await this.waitArdentmill();

    await keyboard.pressKey(Key.Down);
    await keyboard.pressKey(this.character.keybinding.jump);

    await sleep(500);
    await keyboard.releaseKey(this.character.keybinding.jump);
    await keyboard.releaseKey(Key.Down);

    await keyboard.pressKey(Key.Left);
    await sleep(7000);
    await keyboard.releaseKey(Key.Left);
  }

  public async activeAlchemy() {
    const deactiveAlchemy = await getImage(
      MapleResource.연금술_비활성화_상태_버튼,
    );

    if (deactiveAlchemy == null) {
      return;
    }

    await moveClick(deactiveAlchemy);
  }

  public async openAlchemy() {
    await keyboard.pressKey(this.character.keybinding.productionSkill);
    await keyboard.releaseKey(this.character.keybinding.productionSkill);
  }

  public async searchRecipe(txt: string) {
    const recipeButton = await findImageWhile(
      MapleResource.제작가능_레시피_버튼,
    );

    if (recipeButton == null) {
      throw new Error('제작가능 레시피 버튼을 찾을 수 없습니다.');
    }

    const region = new Region(
      recipeButton.left + 14,
      recipeButton.top + 25,
      220,
      2,
    );

    await mouse.move(straightTo(randomPointIn(region)));
    await sleep(300);
    await mouse.leftClick();
    await sleep(500);

    await mouse.doubleClick(Button.LEFT);
    await sleep(1000);

    await keyboard.pressKey(Key.Home);
    await keyboard.releaseKey(Key.Home);

    await keyboard.pressKey(Key.LeftShift);
    await keyboard.pressKey(Key.End);
    await keyboard.releaseKey(Key.End);
    await keyboard.releaseKey(Key.LeftShift);

    await keyboard.pressKey(Key.Delete);
    await keyboard.releaseKey(Key.Delete);

    await clipboard.setContent(txt);
    await keyboard.pressKey(Key.LeftControl);
    await keyboard.pressKey(Key.V);
    await keyboard.releaseKey(Key.V);
    await keyboard.releaseKey(Key.LeftControl);

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await moveClick(recipeButton);
    await mouse.leftClick();

    const window = await getActiveWindow();

    while (true) {
      const listRegion = await getImage(MapleResource.버프포션_리스트버튼);
      if (listRegion != null) {
        await mouse.move(straightTo(randomPointIn(listRegion)));
        await sleep(1000);
        await mouse.leftClick();
        await resetMouseV2(window);
      } else {
        break;
      }
    }

    const itemRegion = new Region(
      recipeButton.left + 50,
      recipeButton.top + 65,
      5,
      5,
    );

    await moveClick(itemRegion);
    await sleep(1000);
  }

  public async create() {
    const createButton = await this.findCreateButton();

    await moveClick(createButton);

    const button = await findImageWhile(MapleResource.확인취소_버튼);
    if (button == null) {
      throw new Error('제작 버튼을 찾을 수 없습니다.');
    }

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await sleep(5000);

    const region = await findImageWhile(MapleResource.제작완료_확인버튼);

    if (region == null) {
      throw new Error('제작 완료 화면을 찾을 수 없습니다.');
    }

    await moveClick(region);
  }

  private async findCreateButton() {
    return new Promise<Region>(async (resolve, reject) => {
      let i = 0;
      while (i < 5) {
        const createButton = await getImage(MapleResource.제작하기_버튼);

        if (createButton != null) {
          resolve(createButton);
          break;
        }

        i++;
      }

      reject(new Error('제작하기 버튼을 찾을 수 없습니다.'));
    });
  }
}
