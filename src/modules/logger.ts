export function logger(message: string) {
  console.log(`** Message: ${message}`.padEnd(40) + ` **`);
}