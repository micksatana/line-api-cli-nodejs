"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvGetSpotlightRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/curation`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {string} moduleName
   * @return
   */


  send(channelId, countryCode, moduleName) {
    return this.axios.get(`${this.endpoint}?lineChannelId=${channelId}&country=${countryCode}&module=${moduleName}`);
  }

}

exports.default = LINETvGetSpotlightRequest;
//# sourceMappingURL=linetv-get-sportlight-request.js.map