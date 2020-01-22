"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvRankingRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/ranking`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {number} page
   * @param {number} countPerPage
   * @return {AxiosResponse<LINETvRankingResponseData>}
   */


  send(channelId, countryCode, page = 1, countPerPage = 10) {
    return this.axios.get(`${this.endpoint}/clip?lineChannelId=${channelId}&country=${countryCode}&page=${page}&countPerPage=${countPerPage}`);
  }

}

exports.default = LINETvRankingRequest;
//# sourceMappingURL=linetv-ranking-request.js.map