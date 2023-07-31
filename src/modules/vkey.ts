import ffi from "ffi-napi";
import ref from "ref-napi";
import Struct from "ref-struct-napi";
import sleep from "sleep";

const int = ref.types.int;
const long = ref.types.long;
const ulong = ref.types.ulong;
const ushort = ref.types.ushort;
const uint = ref.types.uint;

const INPUT_KEYBOARD = 1;

const KEYEVENTF_EXTENDEDKEY = 0x0001;
const KEYEVENTF_KEYUP = 0x0002;

const KEY_MAP: { [key: string]: number } = {
  left: 0x25,
  up: 0x26,
  right: 0x27,
  down: 0x28,

  backspace: 0x08,
  tab: 0x09,
  enter: 0x0d,
  shift: 0x10,
  ctrl: 0x11,
  alt: 0x12,
  "caps lock": 0x14,
  esc: 0x1b,
  space: 0x20,
  "page up": 0x21,
  "page down": 0x22,
  end: 0x23,
  home: 0x24,
  insert: 0x2d,
  delete: 0x2e,

  "0": 0x30,
  "1": 0x31,
  "2": 0x32,
  "3": 0x33,
  "4": 0x34,
  "5": 0x35,
  "6": 0x36,
  "7": 0x37,
  "8": 0x38,
  "9": 0x39,

  a: 0x41,
  b: 0x42,
  c: 0x43,
  d: 0x44,
  e: 0x45,
  f: 0x46,
  g: 0x47,
  h: 0x48,
  i: 0x49,
  j: 0x4a,
  k: 0x4b,
  l: 0x4c,
  m: 0x4d,
  n: 0x4e,
  o: 0x4f,
  p: 0x50,
  q: 0x51,
  r: 0x52,
  s: 0x53,
  t: 0x54,
  u: 0x55,
  v: 0x56,
  w: 0x57,
  x: 0x58,
  y: 0x59,
  z: 0x5a,

  f1: 0x70,
  f2: 0x71,
  f3: 0x72,
  f4: 0x73,
  f5: 0x74,
  f6: 0x75,
  f7: 0x76,
  f8: 0x77,
  f9: 0x78,
  f10: 0x79,
  f11: 0x7a,
  f12: 0x7b,
  "num lock": 0x90,
  "scroll lock": 0x91,

  ";": 0xba,
  "=": 0xbb,
  ",": 0xbc,
  "-": 0xbd,
  ".": 0xbe,
  "/": 0xbf,
  "`": 0xc0,
  "[": 0xdb,
  "\\": 0xdc,
  "]": 0xdd,
  "'": 0xde,
};

const KeyboardInput = Struct({
  wVk: ushort,
  wScan: ushort,
  dwFlags: ulong,
  time: ulong,
  dwExtraInfo: ulong,
});

const MouseInput = Struct({
  dx: long,
  dy: long,
  mouseData: ulong,
  dwFlags: ulong,
  time: ulong,
  dwExtraInfo: ulong,
});

const HardwareInput = Struct({
  uMsg: ulong,
  wParamL: ushort,
  wParamH: ushort,
});

const InputUnion = Struct({
  ki: KeyboardInput,
  mi: MouseInput,
  hi: HardwareInput,
});

const Input = Struct({
  type: ulong,
  u: InputUnion,
});

const LPINPUT = ref.refType(Input);

const user32 = ffi.Library("user32", {
  SendInput: ["uint", [uint, LPINPUT, int]],
  MapVirtualKeyExW: ["uint", [uint, uint, uint]],
  mouse_event: ["void", ["uint", "uint", "uint", "uint", "int"]],
});

export function keyDown(key: string) {
  key = key.toLowerCase();
  if (!(key in KEY_MAP)) {
    console.log(`Invalid keyboard input: '${key}'.`);
  } else {
    const input = new Input({
      type: INPUT_KEYBOARD,
      u: { ki: { wVk: KEY_MAP[key] } },
    });
    user32.SendInput(1, input.ref(), Input.size);
  }
}

export function keyUp(key: string) {
  key = key.toLowerCase();
  if (!(key in KEY_MAP)) {
    console.log(`Invalid keyboard input: '${key}'.`);
  } else {
    const input = new Input({
      type: INPUT_KEYBOARD,
      u: { ki: { wVk: KEY_MAP[key], dwFlags: KEYEVENTF_KEYUP } },
    });
    user32.SendInput(1, input.ref(), Input.size);
  }
}

export function press(key: string, n: number, down_time = 50, up_time = 100) {
  for (let i = 0; i < n; i++) {
    console.log(down_time * (800 + 400 * Math.random()));
    keyDown(key);
    sleep.msleep(Math.floor(down_time * (8 + 4 * Math.random())));
    keyUp(key);
    sleep.msleep(Math.floor(up_time * (8 + 4 * Math.random())));
  }
}

interface Position {
  x: number;
  y: number;
}

type Button = "left" | "right";
const MOUSEEVENTF_LEFTDOWN = 0x0002;
const MOUSEEVENTF_LEFTUP = 0x0004;

const MOUSEEVENTF_RIGHTDOWN = 0x0008;
const MOUSEEVENTF_RIGHTUP = 0x0010;

export function click(position: Position, button: Button = "left") {
  if (button !== "left" && button !== "right") {
    console.log(`'${button}' is not a valid mouse button.`);

    return;
  }

  return new Promise((resolve) => {
    if (button === "left") {
      user32.mouse_event(MOUSEEVENTF_LEFTDOWN, position.x, position.y, 0, 0);
      user32.mouse_event(MOUSEEVENTF_LEFTUP, position.x, position.y, 0, 0);
    }
  
    if (button === "right") {
      user32.mouse_event(MOUSEEVENTF_RIGHTDOWN, position.x, position.y, 0, 0);
      user32.mouse_event(MOUSEEVENTF_RIGHTUP, position.x, position.y, 0, 0);
    }

    resolve(null);
  })
}
