import fs from 'fs';
import { normaliseArrayArg } from './helpers';

export function grep(patterns, files) {
  patterns = normaliseArrayArg(patterns);

  return (files || []).filter((file) => {
    if (file.info.isFile()) {
      const data = fs.readFileSync(file.path, 'utf8');
      return patterns.some((i) => i.test(data));
    }
    return false;
  });
}
