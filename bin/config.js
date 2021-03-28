"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = exports.CONFIG_FILE_NAME = void 0;
const safe_1 = require("colors/safe");
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
exports.CONFIG_FILE_NAME = '.line-api-cli.yml';
const loadConfig = () => {
    let configFile;
    try {
        configFile = fs_1.readFileSync(`./${exports.CONFIG_FILE_NAME}`);
    }
    catch (_) {
        console.log(safe_1.green(`Run command ${safe_1.cyan('line init')} to initialize project configuration file`));
        process.exit(0);
    }
    try {
        return js_yaml_1.load(configFile);
    }
    catch (error) {
        console.log('Unable to safe load configuration file', error);
        process.exit(1);
    }
};
exports.loadConfig = loadConfig;
//# sourceMappingURL=config.js.map