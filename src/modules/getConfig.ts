import fs from 'fs';
import { Config } from '../types/config';

let globalConfig: Config | null = null;

export async function getConfig() {
  return new Promise<Config>((resolve, reject) => {
    if (globalConfig == null) {
      fs.readFile(`config.json`, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }

        const config = JSON.parse(data);

        globalConfig = config;

        resolve(globalConfig!);
      });

      return;
    }

    resolve(globalConfig);
  });
}
