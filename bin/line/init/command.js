"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const fs_1 = require("fs");
const safe_1 = require("colors/safe");
const config_1 = require("../../config");
const js_yaml_1 = require("js-yaml");
const prompts_1 = __importDefault(require("prompts"));
const command = async (options) => {
    const exists = fs_1.existsSync(`./${config_1.CONFIG_FILE_NAME}`);
    if (exists === true) {
        console.log(safe_1.yellow(`${config_1.CONFIG_FILE_NAME} already exists`));
        const { overwrite } = await prompts_1.default({
            type: 'toggle',
            name: 'overwrite',
            message: 'Do you want to overwrite?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        });
        if (!overwrite) {
            process.exit(0);
        }
    }
    console.log(safe_1.green('Setting up configuration file'));
    const { id } = await prompts_1.default({
        type: 'number',
        name: 'id',
        message: 'Channel ID?',
        hint: 'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
    }, {
        onCancel: () => process.exit(0)
    });
    const { secret } = await prompts_1.default({
        type: 'text',
        name: 'secret',
        message: 'Channel Secret?'
    }, {
        onCancel: () => process.exit(0)
    });
    const { hasLongLivedAccessToken } = await prompts_1.default({
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
        const rsToken = await prompts_1.default({
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
    console.log(safe_1.white(`Successfully written configuration file at ./${config_1.CONFIG_FILE_NAME}`));
    process.exit(0);
};
exports.command = command;
//# sourceMappingURL=command.js.map