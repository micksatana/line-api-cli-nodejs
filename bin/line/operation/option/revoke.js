"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revoke = void 0;
const safe_1 = __importDefault(require("colors/safe"));
const config_1 = require("../../../config");
const prompts_1 = __importDefault(require("prompts"));
const oauth2_1 = require("../../../api/login/oauth2");
const revoke = async () => {
    const { accessToken } = await prompts_1.default({
        type: 'text',
        name: 'accessToken',
        message: 'Paste access token you want to revoke here'
    });
    if (!accessToken) {
        return false;
    }
    try {
        const response = await oauth2_1.revokeAccessToken({
            access_token: accessToken,
            client_id: `${config_1.config().channel.id}`,
            client_secret: config_1.config().channel.secret
        });
        if (response.status === 200) {
            console.log(safe_1.default.green('Revoked'));
            return true;
        }
        else {
            console.log(safe_1.default.yellow(`Response with status ${response.status}`));
            return false;
        }
    }
    catch (error) {
        console.error(safe_1.default.red(`${error.response.statusText} or invalid token`));
        return false;
    }
};
exports.revoke = revoke;
//# sourceMappingURL=revoke.js.map