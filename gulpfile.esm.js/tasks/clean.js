import fs from 'fs-extra';
import config from '../config';

export function cleanTask() {
  return fs.remove(config.distPath);
}
