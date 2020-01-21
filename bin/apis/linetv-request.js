"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/line-tv/v1';
    this.axios = _axios.default.create({
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        'content-type': 'application/json'
      }
    });
  }

}

exports.default = LINETvRequest;
//# sourceMappingURL=linetv-request.js.map