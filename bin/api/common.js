"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestData = void 0;
const qs_1 = require("qs");
const requestData = (axios) => (data) => {
    return axios.request({ data: qs_1.stringify(data) });
};
exports.requestData = requestData;
//# sourceMappingURL=common.js.map