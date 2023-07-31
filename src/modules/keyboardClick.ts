import { sleep, keyboard, Key } from "@nut-tree/nut-js";
import "@nut-tree/template-matcher";

type Parameter = Parameters<typeof keyboard.type>;

export async function randomTypeKeyboard(...args: Parameter) {
  for await (const key of args) {
    const randomMs = 100 + Math.floor(Math.random() * 51); // 150에서 200 사이의 정수를 랜덤하게 생성
    keyboard.config.autoDelayMs = randomMs

    await keyboard.type(key as string);
  }
}