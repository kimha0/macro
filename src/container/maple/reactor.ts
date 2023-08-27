import { Reactor } from '../../actions/maplestory/reactor';
import { Character } from '../../resource/maplestory/character';

export class ReactorContainer {
  public action: Reactor;
  public initialized = false;

  constructor(
    public character: Character,
    public recipeName: string,
  ) {
    this.action = new Reactor(character);
  }

  public async tick() {
    if (!this.initialized) {
      await this.action.goToTheAlchemyPlace();
      await this.action.openAlchemy();
      await this.action.activeAlchemy();
      await this.action.searchRecipe(this.recipeName);

      this.initialized = true;
    }
    await this.action.create();
  }
}
