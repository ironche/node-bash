import fs from 'fs-extra';
import config from '../config';

export function cleanTask(cb) {
  fs.removeSync(config.distPath);
  cb();
}
