import { Key, keyboard, sleep } from '@nut-tree/nut-js';
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
}
