"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issue = void 0;
const config_1 = require("../../../config");
const safe_1 = __importDefault(require("colors/safe"));
const js_yaml_1 = require("js-yaml");
const oauth2_1 = require("../../../api/login/oauth2");
const prompts_1 = __importDefault(require("prompts"));
const fs_1 = require("fs");
const issue = async () => {
    let accessToken;
    let expiryDate = new Date();
    try {
        const response = await oauth2_1.issueAccessToken({
            grant_type: 'client_credentials',
            client_id: `${config_1.config().channel.id}`,
            client_secret: config_1.config().channel.secret
        });
        accessToken = response.data.access_token;
        expiryDate.setSeconds(response.data.expires_in);
        console.log(safe_1.default.green(`Access token: ${safe_1.default.white(accessToken)}`));
        console.log(safe_1.default.green(`Expiry date: ${safe_1.default.white(expiryDate.toLocaleString())}`));
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
            ...config_1.config()
        };
        newConfig.channel.accessToken = accessToken;
        fs_1.writeFileSync(`./${config_1.CONFIG_FILE_NAME}`, js_yaml_1.dump(newConfig));
    }
    return true;
};
exports.issue = issue;
//# sourceMappingURL=issue.js.map