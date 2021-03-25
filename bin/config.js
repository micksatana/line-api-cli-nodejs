"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.CONFIG_FILE_NAME = void 0;
const fs_1 = require("fs");
const safe_1 = __importDefault(require("colors/safe"));
const js_yaml_1 = require("js-yaml");
let _config;
exports.CONFIG_FILE_NAME = '.line-api-cli.yml';
const config = () => {
    if (!_config) {
        let configFile;
        try {
            configFile = fs_1.readFileSync(`./${exports.CONFIG_FILE_NAME}`);
        }
        catch (_) {
            console.log(safe_1.default.green(`Run command ${safe_1.default.cyan('line init')} to initialize project configuration file`));
            process.exit(0);
        }
        try {
            _config = js_yaml_1.load(configFile);
        }
        catch (error) {
            console.log('Unable to safe load configuration file', error);
            process.exit(1);
        }
    }
    return _config;
};
exports.config = config;
//# sourceMappingURL=config.js.map