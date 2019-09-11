"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _axios = require("axios");

var _qs = _interopRequireDefault(require("qs"));

var _oauthRequest = _interopRequireDefault(require("./oauth-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OAuthRevokeTokenRequest extends _oauthRequest.default {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/revoke`;
  }
  /**
   * @param {string} accessToken 
   * @return {AxiosResponse}
   */


  send(accessToken) {
    return this.axios.post(`${this.endpoint}`, _qs.default.stringify({
      access_token: accessToken
    }));
  }

}

exports.default = OAuthRevokeTokenRequest;
//# sourceMappingURL=oauth-revoke-token-request.js.map