# Node BASH

This project aims to provide NodeJS implementation of frequently used BASH commands and extend their functionality even further.

![AppVeyor](https://img.shields.io/appveyor/build/ironche/node-bash?logo=appveyor)
![AppVeyor tests](https://img.shields.io/appveyor/tests/ironche/node-bash?logo=appveyor)
![npm](https://img.shields.io/npm/dm/@ironche/node-bash?logo=npm)

## Installation

```shell
npm install @ironche/node-bash
```

## Contents

- **find** - search for files and folders in a folder hierarchy
- **grep** - find files containing patterns

# Function find()

Traverse file system and search for files and folders recursively.

## Syntax

**Note**: All arguments are optional.

| Argument | Description |
| -------- | ----------- |
| path  | Folder from where the search begins. If omitted, the default value is the current folder, which is identical to './' |
| descriptor | Pass 'f' to search only for files, 'd' to search only for folders/directories, or null (anything else) if the search applies to both. |
| namePatterns | Regular expression (or array of regular expressions) to match names of files and folders and return them as result. Matches all names if omitted. |
| excludeFolders | Regular expression (or array of regular expressions) to exclude folders and their contents from search results. |
| depth | Used to limit the depth while traversing file system. Set to 0 to search only current level without entering any folders, 1 to go down one level, and so on. If omitted, traverses whole folder tree. |

**Return value**: array of objects found.

```js
import { find } from '@ironche/node-bash';
let args, results;

// find-example-1.js
args = ['.', 'f', null, /node_modules/];
results = find(...args).map((f) => f.path);
console.log(results);

/* example output
[
  './.gitignore',
  './index.js',
  './package-lock.json',
  './package.json'
]
*/

// find-example-2.js
args = ['.', 'f', /\.json$/, /node_modules/];
results = find(...args).map((f) => f.path);
console.log(results);

/* example output
[
  './package-lock.json',
  './package.json'
]
*/
```

# Function grep()

Read files and return those containing matched patterns.

## Syntax

**Note**: All arguments are optional.

| Argument | Description |
| -------- | ----------- |
| patterns  | Regular expression (or array of regular expressions) to match content of files and return files as result. Doesn't match any file if omitted. |
| files | Array of files found by using **find** function. |

**Return value**: array of files that contain given patterns.

```js
import { find, grep } from '@ironche/node-bash';

// find all files having extension "css"
const files = find('.', 'f', /\.css$/, /node_modules/);
// among supplied files, return only those containing text "white"
const results = grep(/white/, files);
console.log(results);

/* example output
[
  './theme-light.css',
  './button.css',
]
*/
```
