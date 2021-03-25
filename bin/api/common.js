"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestData = void 0;
const qs_1 = require("qs");
const oauth2_1 = require("../../bin/api/login/oauth2");
const requestData = (axios) => (data) => {
    return axios.post(oauth2_1.ISSUE_ENDPOINT, qs_1.stringify(data));
};
exports.requestData = requestData;
//# sourceMappingURL=common.js.map