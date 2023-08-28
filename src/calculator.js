class Character {
  constructor() {
    this.fatigue = 0;
    this.potionCooldown = 0;
  }

  canMakePotion(accountCooldown) {
    return (
      this.fatigue < 200 && this.potionCooldown === 0 && accountCooldown === 0
    );
  }

  makePotion() {
    this.fatigue += 20;
    this.potionCooldown = 5; // 5분 쿨타임
  }

  passTime(minutes) {
    this.potionCooldown -= minutes;
    if (this.potionCooldown < 0) {
      this.potionCooldown = 0;
    }
  }

  reduceFatigue() {
    this.fatigue -= 20;
    if (this.fatigue < 0) {
      this.fatigue = 0;
    }
  }
}

function simulatePotionMakingWithMultipleCharacters(hours, characterCount) {
  const characters = Array.from(
    { length: characterCount },
    () => new Character(),
  );
  let totalPotions = 0;
  let currentTime = 0;
  let accountCooldown = 0; // 계정 전체 쿨타임

  while (currentTime < hours * 60) {
    if (currentTime % 60 === 0) {
      // 정각마다 모든 캐릭터의 피로도 감소
      characters.forEach((character) => character.reduceFatigue());
    }

    const availableCharacter = characters.find((c) =>
      c.canMakePotion(accountCooldown),
    );

    if (availableCharacter) {
      availableCharacter.makePotion();
      totalPotions += 20;
      accountCooldown = 5; // 계정 전체에 쿨타임 부여
      currentTime += 5;
      characters.forEach((character) => character.passTime(5));
    } else {
      // 물약을 만들 수 있는 캐릭터가 없는 경우 1분 경과
      accountCooldown -= 1;
      currentTime += 1;
      characters.forEach((character) => character.passTime(1));
    }
  }

  return totalPotions;
}

const hours = 16;
const characterCount = 5; // 원하는 캐릭터 수를 지정
console.log(simulatePotionMakingWithMultipleCharacters(hours, characterCount)); // 24시간 동안 여러 캐릭터로 만들 수 있는 물약의 수
