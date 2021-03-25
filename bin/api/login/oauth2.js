"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAccessToken = exports.RevokeAccessTokenService = exports.issueAccessToken = exports.IssueAccessTokenService = exports.REVOKE_ENDPOINT = exports.ISSUE_ENDPOINT = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("../common");
exports.ISSUE_ENDPOINT = 'https://api.line.me/v2/oauth/accessToken';
exports.REVOKE_ENDPOINT = 'https://api.line.me/v2/oauth/revoke';
exports.IssueAccessTokenService = axios_1.default.create({
    baseURL: exports.ISSUE_ENDPOINT,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
});
exports.issueAccessToken = common_1.requestData(exports.IssueAccessTokenService);
exports.RevokeAccessTokenService = axios_1.default.create({
    baseURL: exports.REVOKE_ENDPOINT,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
});
exports.revokeAccessToken = common_1.requestData(exports.RevokeAccessTokenService);
//# sourceMappingURL=oauth2.js.map