import { logger } from "../modules/logger";
import { GlobalKeyboardListener } from 'node-global-key-listener';

class Process {
  private keyboardEvent = new GlobalKeyboardListener();
  public pause = false;

  public release() {
    this.keyboardEvent.addListener((e, down) => {
      if (e.name === 'NUMPAD PLUS' && e.state === 'DOWN') {
        this.pause = !this.pause;

        logger(`${this.pause ? "일시 정지함" : "다시 시작함"}`);
      }
    });
  }

  public beep() {
    process.stderr.write("\x07");
  }

  public time() {
    console.time('start');
  }

  public timeEnd() {
    console.timeEnd('start');
  }

  public exit() {
    process.exit(1);
  }
}

export const processSingleton = new Process();
