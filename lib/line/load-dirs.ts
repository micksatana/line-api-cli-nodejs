import { readdirSync } from 'fs';
import { resolve } from 'path';

export const loadDirs = <T>(baseDir) => (): T => {
  return readdirSync(resolve(baseDir), {
    withFileTypes: true
  })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        /^[a-z]{1,}([-a-z]{1,})?[a-z]$/g.test(dirent.name)
    )
    .reduce((prev, dirent) => {
      prev[dirent.name] = require(resolve(baseDir, dirent.name));
      return prev;
    }, {}) as T;
};
