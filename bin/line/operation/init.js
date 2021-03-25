"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.InitUsage = void 0;
const fs_1 = require("fs");
const config_1 = require("../../config");
const os_1 = require("os");
const safe_1 = __importDefault(require("colors/safe"));
const js_yaml_1 = require("js-yaml");
exports.InitUsage = [
    {
        header: safe_1.default.green('Initialize configuration file for LINE API CLIs'),
        content: 'Initialize configuration file' +
            os_1.EOL +
            os_1.EOL +
            safe_1.default.cyan('line init') +
            os_1.EOL +
            os_1.EOL +
            `This command should be run first time under project root folder. After run successfully, you will get ${config_1.CONFIG_FILE_NAME} configuration file`
    }
];
const init = async (options) => {
    const prompts = require('prompts');
    const exists = fs_1.existsSync(`./${config_1.CONFIG_FILE_NAME}`);
    if (exists === true) {
        console.log(safe_1.default.yellow(`${config_1.CONFIG_FILE_NAME} already exists`));
        const { overwrite } = await prompts({
            type: 'toggle',
            name: 'overwrite',
            message: 'Do you want to overwrite?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        });
        if (!overwrite) {
            return false;
        }
    }
    console.log(safe_1.default.green('Setting up configuration file'));
    const { id } = await prompts({
        type: 'number',
        name: 'id',
        message: 'Channel ID?',
        hint: 'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
    }, {
        onCancel: () => process.exit(0)
    });
    const { secret } = await prompts({
        type: 'text',
        name: 'secret',
        message: 'Channel Secret?'
    }, {
        onCancel: () => process.exit(0)
    });
    const { hasLongLivedAccessToken } = await prompts({
        type: 'toggle',
        name: 'hasLongLivedAccessToken',
        message: 'Do you have long-lived access token?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
    }, {
        onCancel: () => process.exit(0)
    });
    let accessToken = '';
    if (hasLongLivedAccessToken) {
        const rsToken = await prompts({
            type: 'text',
            name: 'accessToken',
            message: 'Long-lived access token?'
        }, {
            onCancel: () => process.exit(0)
        });
        accessToken = rsToken.accessToken;
    }
    const newConfig = {
        channel: { id, secret, accessToken }
    };
    fs_1.writeFileSync(`./${config_1.CONFIG_FILE_NAME}`, js_yaml_1.dump(newConfig));
    console.log(safe_1.default.white(`Successfully written configuration file at ./${config_1.CONFIG_FILE_NAME}`));
    return true;
};
exports.init = init;
//# sourceMappingURL=init.js.map