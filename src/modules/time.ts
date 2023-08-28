export class Time {
  public diffHours(date: Date) {
    const differenceInMilliseconds = this.getTime().getTime() - date.getTime();
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
  }

  public isDiffDay(date: Date) {
    return this.getTime().getDay() != date.getDay();
  }

  public getTime() {
    const date = new Date();

    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }
}

export const timeSingleton = new Time();
