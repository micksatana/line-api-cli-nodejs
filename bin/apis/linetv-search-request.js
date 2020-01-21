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
    this.endpoint = `${this.endpoint}/search`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {number} page
   * @param {number} countPerPage
   * @param {string} query
   * @return {AxiosResponse<LINETvSearchResponseData>}
   */


  send(channelId, countryCode, query, page = 1, countPerPage = 10) {
    return this.axios.get(`${this.endpoint}/clip?lineChannelId=${channelId}&country=${countryCode}&query=${query}&page=${page}&countPerPage=${countPerPage}`);
  }

}

exports.default = LINETvRankingRequest;
//# sourceMappingURL=linetv-search-request.js.map