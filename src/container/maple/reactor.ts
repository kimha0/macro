import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { ChangeCharacter } from '../../actions/maplestory/changeCharacter';
import { Reactor } from '../../actions/maplestory/reactor';
import { Account } from '../../resource/maplestory/accounts';
import { Character } from '../../resource/maplestory/character';
import { timeSingleton } from '../../modules/time';
import { logger } from '../../modules/logger';
import { sendFatigueWebhook } from '../../modules/discord-webhook';

export class ReactorContainer {
  public actions: ReactorEvent[];
  public needChangeCharacter = false;
  public prevCharacter: Character;

  constructor(
    public account: Account,
    public characters: Character[],
  ) {
    this.actions = characters.map((x) => new ReactorEvent(x));
    this.prevCharacter = characters[0];
  }

  public async tick() {
    for await (const action of this.actions) {
      this.needChangeCharacter =
        this.prevCharacter.name !== action.character.name &&
        action.canMakePotion();
      const changeCharacter = new ChangeCharacter(
        this.account,
        action.character,
      );

      await changeCharacter.clearScreen();

      if (this.needChangeCharacter) {
        await keyboard.pressKey(Key.Escape);
        await keyboard.releaseKey(Key.Escape);

        await keyboard.pressKey(Key.Up);
        await keyboard.releaseKey(Key.Up);

        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);

        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);

        await changeCharacter.waitLoginScreen();
        await changeCharacter.clickCharacter();
        await changeCharacter.checkTwoFactor();
        await changeCharacter.clearScreen();

        logger(`캐릭터 변경: ${changeCharacter.character.name}`);
      }

      const character = await action.start(this.prevCharacter);

      if (character != null) {
        this.prevCharacter = character;
      }
    }

    logger(`cycle end`);
  }

  public async test() {
    for await (const action of this.actions) {
      this.needChangeCharacter =
        this.prevCharacter.name !== action.character.name &&
        action.canMakePotion();
      const changeCharacter = new ChangeCharacter(
        this.account,
        action.character,
      );

      await changeCharacter.clearScreen();

      if (this.needChangeCharacter) {
        await keyboard.pressKey(Key.Escape);
        await keyboard.releaseKey(Key.Escape);

        await keyboard.pressKey(Key.Up);
        await keyboard.releaseKey(Key.Up);

        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);

        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);

        await changeCharacter.waitLoginScreen();
        await changeCharacter.clickCharacter();
        await changeCharacter.checkTwoFactor();
        await changeCharacter.clearScreen();
      }

      const character = await action.test(this.prevCharacter);

      if (character != null) {
        this.prevCharacter = character;
      }
    }
  }
}

class ReactorEvent {
  public action: Reactor;
  public fatigue = 0;
  public date = timeSingleton.getTime();

  constructor(public character: Character) {
    this.action = new Reactor(character);
    this.fatigue = character.fatigue;
  }

  public canMakePotion() {
    const diffHours = timeSingleton.diffHours(this.date);
    const diffDays = timeSingleton.isDiffDay(this.date);

    if (diffDays) {
      this.fatigue = 0;
      this.date = timeSingleton.getTime();
    } else if (diffHours > 0) {
      this.fatigue -= diffHours * 20;
      this.date = timeSingleton.getTime();

      if (this.fatigue < 0) {
        this.fatigue = 0;
      }
    }

    if (this.fatigue >= 200) {
      return false;
    }

    return true;
  }

  public async start(prevCharacter: Character) {
    if (!this.canMakePotion()) {
      return null;
    }

    let waitSecond = 0;

    if (prevCharacter.name !== this.character.name) {
      await this.action.goToTheAlchemyPlace();
    }

    await this.action.openAlchemy();
    await this.action.activeAlchemy();

    for await (const alchemy of this.character.alchemis) {
      if (!this.canMakePotion()) {
        break;
      }

      await this.action.searchRecipe(alchemy.name);
      await this.action.create();

      this.fatigue += alchemy.fatigue;

      logger(`${this.character.name} - ${alchemy.name} 제작 완료`);

      if (waitSecond < alchemy.cooltime) {
        waitSecond = alchemy.cooltime;
      }
    }

    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);
    sendFatigueWebhook(`${this.character.name}: 피로도(${this.fatigue})`);

    logger(`${waitSecond}초 기다림`);
    await sleep(waitSecond * 1000);

    return this.character;
  }

  public async test(prevCharacter: Character) {
    if (prevCharacter.name !== this.character.name) {
      await this.action.goToTheAlchemyPlace();
    }

    await this.action.openAlchemy();
    await this.action.activeAlchemy();

    for await (const alchemy of this.character.alchemis) {
      if (!this.canMakePotion()) {
        break;
      }

      await this.action.searchRecipe(alchemy.name);
    }

    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);

    return this.character;
  }
}
