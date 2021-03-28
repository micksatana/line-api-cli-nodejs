"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDirs = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const loadDirs = (baseDir) => () => {
    return fs_1.readdirSync(path_1.resolve(baseDir), {
        withFileTypes: true
    })
        .filter((dirent) => dirent.isDirectory() &&
        /^[a-z]{1,}([-a-z]{1,})?[a-z]$/g.test(dirent.name))
        .reduce((prev, dirent) => {
        prev[dirent.name] = require(path_1.resolve(baseDir, dirent.name));
        return prev;
    }, {});
};
exports.loadDirs = loadDirs;
//# sourceMappingURL=load-dirs.js.map