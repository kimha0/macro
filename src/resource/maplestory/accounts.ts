import { Character } from "./character";

export class Accounts {
  constructor(
    public useOTP: boolean,
    public twoFactorPassword: string,
    public characters: Character[],
  ) { }
}