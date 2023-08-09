export function getErinTime() {
  const now = new Date();

  // 자정(오늘의 0시 시각을 구함)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // 자정부터 현재까지 지난 밀리초를 구함
  const todayTotalMs = now.getTime() - todayStart.getTime();

  // 에린의 현재 누적된 분(Min)을 구함. (에린시간은 1.5초당 1분이 지나기 때문에 1.5로 나누었음.)
  const erinTotalMin = todayTotalMs / (1.5 * 1000); // 밀리초 단위로 1.5초를 나눔

  // 에린의 하루 시간을 구함. 누적된 시간에서 오늘로부터 지난 시간을 구함(24 * 60 - 하루)
  const erinTodayMin = erinTotalMin % (60 * 24);

  const erinDaysOfToday = Math.floor(erinTotalMin / (60 * 24));
  const erinHour = Math.floor(erinTodayMin / 60); // 에린시간 시
  const erinMin = erinTodayMin % 60;


  return {
    days: erinDaysOfToday,
    hour: erinHour,
    minute: erinMin,
  }
}