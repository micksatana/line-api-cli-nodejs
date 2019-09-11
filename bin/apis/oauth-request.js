"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OAuthRequest {
  constructor() {
    this.endpoint = 'https://api.line.me/v2/oauth';
    this.axios = _axios.default.create({
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
  }

}

exports.default = OAuthRequest;
//# sourceMappingURL=oauth-request.js.map