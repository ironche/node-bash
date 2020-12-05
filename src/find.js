import fs from 'fs';
import { normaliseArrayArg } from './helpers';

export function find(path, descriptor, namePatterns, excludeFolders, depth, results) {
  path = path || '.';
  namePatterns = normaliseArrayArg(namePatterns);
  descriptor = /^[df]$/.test(descriptor) ? descriptor : '*';
  excludeFolders = normaliseArrayArg(excludeFolders);
  depth = Number.isInteger(depth) ? depth : Number.MAX_SAFE_INTEGER;
  results = results || [];

  for (const item of fs.readdirSync(path, 'utf8')) {
    const itemPath = `${path}/${item}`;
    const stat = fs.statSync(itemPath);
    const isPatternMatched = namePatterns.length ? namePatterns.some((i) => i.test(item)) : true;

    if (stat.isDirectory()) {
      if (!excludeFolders.some((i) => i.test(item))) {
        if (isPatternMatched && ['*', 'd'].includes(descriptor)) {
          results.push({
            name: item,
            path: itemPath,
            info: stat,
          });
        }
        if (depth) {
          find(itemPath, descriptor, namePatterns, excludeFolders, depth - 1, results);
        }
      }
    } else {
      if (isPatternMatched && ['*', 'f'].includes(descriptor)) {
        results.push({
          name: item,
          path: itemPath,
          info: stat,
        });
      }
    }
  }
  return results;
}
