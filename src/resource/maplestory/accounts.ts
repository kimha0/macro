export class Account {
  constructor(
    public useTwoFactor: boolean,
    public twoFactorPassword: string,
  ) {}
}
