"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.VerifyAccessTokenService = exports.VERIFY_ENDPOINT = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("../../common");
exports.VERIFY_ENDPOINT = 'https://api.line.me/v2/oauth/verify';
exports.VerifyAccessTokenService = axios_1.default.create({
    baseURL: exports.VERIFY_ENDPOINT,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
});
exports.verifyAccessToken = common_1.requestData(exports.VerifyAccessTokenService);
//# sourceMappingURL=verify.js.map