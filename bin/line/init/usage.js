"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.usage = void 0;
const safe_1 = require("colors/safe");
const config_1 = require("../../config");
const os_1 = require("os");
const print_usage_1 = require("../print-usage");
exports.usage = [
    {
        header: safe_1.green('Initialize configuration file for LINE API CLIs'),
        content: 'Initialize configuration file' +
            os_1.EOL +
            os_1.EOL +
            safe_1.cyan('line init') +
            os_1.EOL +
            os_1.EOL +
            `This command should be run first time under project root folder. After run successfully, you will get ${config_1.CONFIG_FILE_NAME} configuration file`
    }
];
exports.print = print_usage_1.printUsage(exports.usage);
//# sourceMappingURL=usage.js.map