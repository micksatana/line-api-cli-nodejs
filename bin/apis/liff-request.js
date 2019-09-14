"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LIFFRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/liff/v1/apps';
    this.axios = _axios.default.create({
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        'content-type': 'application/json'
      }
    });
  }

}

exports.default = LIFFRequest;
//# sourceMappingURL=liff-request.js.map