export function getRandomValues(min: number, max = min) {
  return Math.floor(Math.random() * max + min);
}
