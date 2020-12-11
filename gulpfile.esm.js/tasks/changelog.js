import fs from 'fs-extra';
import { exec } from 'child_process';
import { Transform } from 'stream';

export function changelogTask(cb) {
  shell(`git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%s"`)
    .then((shellOutput) => {
      const changelog = 'CHANGELOG.md';
      const changelogTemp = changelog + '.temp';
      const commits = parseGitLog(shellOutput);
      const packageJson = fs.readJSONSync('package.json', 'utf8');
      const reader = fs.createReadStream(changelog, 'utf8');
      const writer = fs.createWriteStream(changelogTemp, 'utf8');

      reader
        .pipe(addCommits(packageJson, commits))
        .pipe(writer)
        .on('finish', () => {
          fs.renameSync(changelogTemp, changelog);
          cb();
        });
    })
    .catch(cb);
}

function addCommits(packageJson, commits) {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      if (!this.hasLogHeader) {
        const tableBodyIndex = 49;
        this.push(chunk.slice(0, tableBodyIndex));
        let changes = `| ${packageJson.version} | `;
        changes += commits.reduce((acc, i) => acc + `${i} <br> `, '');
        changes += '|\n';
        this.push(changes);
        this.push(chunk.slice(tableBodyIndex));
        this.hasLogHeader = true;
      } else {
        this.push(chunk);
      }

      callback();
    },
  });
}

function parseGitLog(shellOutput) {
  return [...new Set(shellOutput.stdout.split('\n'))]
    .filter((line) => !/^merge/i.test(line))
    .sort((first, second) => {
      const a = commitType(first);
      const b = commitType(second);

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

  function commitType(str) {
    return str.slice(0, str.indexOf(':'));
  }
}

function shell(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        stderr,
        stdout,
      });
    });
  });
}
