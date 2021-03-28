"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issue = void 0;
const config_1 = require("../../../config");
const safe_1 = require("colors/safe");
const js_yaml_1 = require("js-yaml");
const oauth2_1 = require("../../../api/login/oauth2");
const prompts_1 = __importDefault(require("prompts"));
const fs_1 = require("fs");
const issue = async () => {
    const config = config_1.loadConfig();
    let accessToken;
    let expiryDate = new Date();
    try {
        const response = await oauth2_1.issueAccessToken({
            grant_type: 'client_credentials',
            client_id: `${config.channel.id}`,
            client_secret: config.channel.secret
        });
        accessToken = response.data.access_token;
        expiryDate.setSeconds(response.data.expires_in);
        console.log(safe_1.green(`Access token: ${safe_1.white(accessToken)}`));
        console.log(safe_1.green(`Expiry date: ${safe_1.white(expiryDate.toISOString())}`));
    }
    catch (error) {
        console.error(error);
        return false;
    }
    const { save } = await prompts_1.default({
        type: 'toggle',
        name: 'save',
        message: 'Overwrite short-lived access token to configuration file?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
    });
    if (save) {
        const newConfig = {
            ...config
        };
        newConfig.channel.accessToken = accessToken;
        fs_1.writeFileSync(`./${config_1.CONFIG_FILE_NAME}`, js_yaml_1.dump(newConfig));
    }
    return true;
};
exports.issue = issue;
//# sourceMappingURL=issue.js.map