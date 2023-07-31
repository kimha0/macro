import tesseract from 'node-tesseract-ocr';

type TesseractConfig = Parameters<typeof tesseract.recognize>[1];

export async function findText(text: string, image: tesseract.Input, config: TesseractConfig = { lang: 'kor', oem: 3, psm: 3 }) {
  try {
    const result = await tesseract.recognize(image, config)

    return result;
  } catch (error) {
    throw error;
  }
}