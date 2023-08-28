import fs from 'fs';
import { Config } from '../types/config';

export async function getConfig() {
  return new Promise<Config>((resolve, reject) => {
    fs.readFile(`config.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      const config = JSON.parse(data);

      resolve(config);
    });
  });
}
