// import { logger } from "../modules/logger";

// const keypress = require('keypress');

// class Process {
//   public stop = false;

//   public start() {
//     keypress(process.stdin);

//     process.stdin.setRawMode(true);
//     process.stdin.resume();

//     process.stdin.on('keypress', (ch, key) => {
//       if (key != null && key.name === '+') {
//         if (this.stop) {
//           logger('다시 진행합니다.');
//         } else {
//           logger('잠시 진행상황을 정지합니다.');
//         }

//         this.stop = !this.stop;
//       }
//     });
//   }
// }

// export const processSingleton = new Process();