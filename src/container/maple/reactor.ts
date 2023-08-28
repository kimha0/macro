import { Reactor } from '../../actions/maplestory/reactor';
import { Account } from '../../resource/maplestory/accounts';
import { Character } from '../../resource/maplestory/character';

export class ReactorContainer {
  public actions: Reactor[];

  constructor(
    public account: Account,
    public characters: Character[],
    public recipeName: string,
  ) {
    this.actions = characters.map((x) => new Reactor(x));
  }

  public async tick() {
    for await (const action of this.actions) {
      await action.goToTheAlchemyPlace();
      await action.openAlchemy();
      await action.activeAlchemy();
      await action.searchRecipe(this.recipeName);

      await action.create();
    }
  }
}
