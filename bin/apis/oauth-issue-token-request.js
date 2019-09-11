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

class OAuthIssueTokenRequest extends _oauthRequest.default {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/accessToken`;
  }
  /**
   * @param {number} channelId
   * @param {string} channelSecret
   * @return {AxiosResponse<IssuedTokenData>}
   */


  send(channelId, channelSecret) {
    return this.axios.post(`${this.endpoint}`, _qs.default.stringify({
      grant_type: 'client_credentials',
      client_id: channelId,
      client_secret: channelSecret
    }));
  }

}

exports.default = OAuthIssueTokenRequest;
//# sourceMappingURL=oauth-issue-token-request.js.map