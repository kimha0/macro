import {
  Key,
  Region,
  clipboard,
  keyboard,
  mouse,
  sleep,
} from '@nut-tree/nut-js';
import { MapleResource } from '../../constants/maplestory';
import { getImage, hasImage } from '../../modules/hasImage';
import { Character } from '../../resource/maplestory/character';
import { moveClick } from '../../modules/moveClick';
import { Channel } from './channel';

export class Reactor {
  public channel: Channel;

  constructor(
    public character: Character,
    delay = 5000,
  ) {
    this.channel = new Channel(delay);
  }

  public async goToArdentmill() {
    const isArdentmill = await hasImage(MapleResource.전문기술마을_미니맵);

    if (isArdentmill) {
      return;
    }

    await keyboard.pressKey(this.character.keybinding.productionSkill);
    await keyboard.releaseKey(this.character.keybinding.productionSkill);

    const 전문기술마을_가기_버튼 = await getImage(
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
    const recipeButton = await getImage(MapleResource.제작가능_레시피_버튼);

    if (recipeButton == null) {
      throw new Error('제작가능 레시피 버튼을 찾을 수 없습니다.');
    }

    const region = new Region(
      recipeButton.left + 4,
      recipeButton.top + 20,
      250,
      8,
    );

    await moveClick(region);
    await sleep(500);
    await clipboard.setContent(txt);
    await keyboard.pressKey(Key.LeftControl);
    await keyboard.pressKey(Key.V);
    await keyboard.releaseKey(Key.V);
    await keyboard.releaseKey(Key.LeftControl);

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await moveClick(recipeButton);
    await mouse.leftClick();
  }

  public async create() {
    const createButton = await getImage(MapleResource.제작하기_버튼);

    if (createButton == null) {
      throw new Error('제작하기 버튼을 찾을 수 없습니다.');
    }

    await moveClick(createButton);

    const button = await hasImage(MapleResource.확인취소_버튼);
    if (!button) {
      throw new Error('제작 버튼을 찾을 수 없습니다.');
    }

    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await sleep(4000);
  }
}
