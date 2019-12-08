export function PreparedCommand() {
  let cmdStore = '';

  function addToStore(newCmd) {
    if (cmdStore) {
      cmdStore += ' ';
    }
    cmdStore += newCmd || '';
  }

  this.toString = () => cmdStore;

  this.debug = () => {
    // eslint-disable-next-line
    console.log(`Prepared command: \`${cmdStore}\``);
    return this;
  };

  this.begin = () => {
    cmdStore = '';
    return this;
  };

  this.pipe = () => {
    addToStore('|');
    return this;
  };

  this.xargs = () => {
    addToStore('xargs');
    return this;
  };

  this.grep = (pattern) => {
    addToStore(`grep -lE "${pattern}"`);
    return this;
  };

  this.find = (startPath, descriptor, pattern, ignoredFolders) => {
    let findCmd = 'find';

    // STEP
    findCmd += ` ${startPath || '.'}`;

    // STEP
    const excludeFolders = (ignoredFolders || [])
      .map((v) => `-path "${v}" -prune`)
      .join(' -o ');
    if (excludeFolders) {
      findCmd += ` ${excludeFolders} -o`;
    }

    // STEP
    const type = (descriptor && /^[df]$/.test(descriptor)) ? descriptor : 'f';
    findCmd += ` -type ${type}`;

    // STEP
    findCmd += ` -name "${pattern || '*'}" -print`;

    addToStore(findCmd);
    return this;
  };

  this.sed = (file, search, replace) => {
    addToStore(`sed -i '' -e "s/${search}/${replace}/g" ${file}`);
    return this;
  };
}
