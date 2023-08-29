export function logger(message: string) {
  console.log(`** Message: ${message}`.padEnd(40) + ` ${new Date().toLocaleTimeString()}\n\n`);
}