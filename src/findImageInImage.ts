import cv, { Mat, Point2 } from "@u4/opencv4nodejs";
import { screenshot } from "./utils/screenshot";

interface Result {
  topLeft: Point2;
  bottomRight: Point2;
}

export async function readImage(src: string) {
  return new Promise<Mat>((resolve, reject) => {
    try {
      const mat = cv.imread(src);

      return resolve(mat);
    } catch (error) {
      reject(error);
    }
  });
}

export function singleMatch(frame: Mat, template: Mat) {
  return new Promise<Result>((resolve, reject) => {
    try {
      const matched = frame.matchTemplate(template, cv.TM_CCOEFF_NORMED);

      const { maxLoc: topLeft } = matched.minMaxLoc();

      const bottomRight = new cv.Point2(
        topLeft.x + template.cols,
        topLeft.y + template.rows
      );

      const result = { topLeft, bottomRight };

      resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
}

interface MultiMatchResult {
  x: number;
  y: number;
}

export function multiMatch(frame: Mat, template: Mat, threshold = 0.95) {
  return new Promise<MultiMatchResult[]>((resolve, reject) => {
    try {
      if (template.rows > frame.rows || template.cols > frame.cols) {
        return [];
      }

      const result = frame.matchTemplate(template, cv.TM_CCOEFF_NORMED);

      const locations = result
        .threshold(threshold, 1, cv.THRESH_BINARY)
        .convertTo(cv.CV_8U)
        .findNonZero();

      const results = locations.map((p) => {
        const x = Math.round(p.x + template.cols / 2);
        const y = Math.round(p.y + template.rows / 2);
        return { x, y };
      });

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}

export async function captureScreen(
  width: number = 1920,
  height: number = 1080
) {
  const { image } = await screenshot(0, 0, width, height);
  const screen = new cv.Mat(image, height, width);

  return screen;
}

