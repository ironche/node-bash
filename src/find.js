import fs from 'fs';

export function find(path, descriptor, namePatterns, excludeFolders, results) {
  const normaliseArrayArg = (arg) => (arg && !Array.isArray(arg) ? [arg] : arg || []);
  path = path || '.';
  namePatterns = normaliseArrayArg(namePatterns);
  descriptor = /^[df]$/.test(descriptor) ? descriptor : '*';
  excludeFolders = normaliseArrayArg(excludeFolders);
  results = results || [];

  for (const item of fs.readdirSync(path, 'utf8')) {
    const itemPath = `${path}/${item}`;
    const stat = fs.statSync(itemPath);
    const isPatternMatched = namePatterns.length ? namePatterns.some((i) => i.test(item)) : true;

    if (stat.isDirectory()) {
      if (!excludeFolders.some((i) => i.test(itemPath))) {
        if (isPatternMatched && ['*', 'd'].includes(descriptor)) {
          results.push({
            name: item,
            path: itemPath,
            info: stat,
          });
        }
        find(itemPath, descriptor, namePatterns, excludeFolders, results);
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
