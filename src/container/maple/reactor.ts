import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { ChangeCharacter } from '../../actions/maplestory/changeCharacter';
import { Reactor } from '../../actions/maplestory/reactor';
import { Account } from '../../resource/maplestory/accounts';
import { Character } from '../../resource/maplestory/character';
import { timeSingleton } from '../../modules/time';

export class ReactorContainer {
  public actions: ReactorEvent[];
  public needChangeCharacter = false;

  constructor(
    public account: Account,
    public characters: Character[],
  ) {
    this.actions = characters.map((x) => new ReactorEvent(x));
  }

  public async tick() {
    const prevCharacter = this.actions[0].character;
    for await (const action of this.actions) {
      this.needChangeCharacter =
        prevCharacter !== action.character && action.canMakePotion();
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
      }

      await action.start(prevCharacter);
    }
  }
}

class ReactorEvent {
  public action: Reactor;
  public fatigue = 0;
  public date = timeSingleton.getTime();

  constructor(public character: Character) {
    this.action = new Reactor(character);
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
    }

    if (this.fatigue >= 200) {
      return false;
    }

    return true;
  }

  public async start(prevCharacter: Character) {
    if (!this.canMakePotion()) {
      return;
    }

    let waitSecond = 0;

    if (prevCharacter !== this.character) {
      await this.action.goToTheAlchemyPlace();
    }

    await this.action.openAlchemy();
    await this.action.activeAlchemy();

    for await (const alchemy of this.character.alchemis) {
      await this.action.searchRecipe(alchemy.name);
      await this.action.create();

      this.fatigue += alchemy.fatigue;

      if (!this.canMakePotion()) {
        break;
      }

      if (waitSecond < alchemy.cooltime) {
        waitSecond = alchemy.cooltime;
      }
    }

    await keyboard.pressKey(Key.Escape);
    await keyboard.releaseKey(Key.Escape);

    await sleep(waitSecond * 1000);
  }
}
