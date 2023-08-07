import { Screenshots } from "node-screenshots";
import tesseract from "node-tesseract-ocr"
import sharp from 'sharp';

interface CaptureOptions {
  top: number;
  left: number;
  width: number;
  height: number;
}

const screenshots = Screenshots.fromPoint(0, 0);

async function convertToGrayscale(imageBuffer: Buffer) {
  return await sharp(imageBuffer)
      .greyscale()
      .toBuffer();
}

export async function getText(options: CaptureOptions, psm = 12) {
  const config = {
    lang: "kor",
    oem: 3,
    psm,
  }

  const buffer = await screenshots!.captureArea(options.left, options.top, options.width, options.height)
sharp
  const grayscaleBuffer = await convertToGrayscale(buffer);
  return tesseract.recognize(grayscaleBuffer, config);
}

export async function hasText(containString: string, options: CaptureOptions) {
  const text = await getText(options);

  return text.includes(containString);
}
