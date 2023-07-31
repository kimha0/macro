import * as robot from "robotjs";

export function screenshot(
  x?: number,
  y?: number,
  width?: number,
  height?: number
) {
  return new Promise<ReturnType<typeof robot.screen.capture>>((resolve, reject) => {
    try {
      const screenshot = robot.screen.capture(x, y, width, height);

      resolve(screenshot);
    } catch (error) {
      reject(error);
    }
  });
}
