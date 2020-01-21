"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvGetCategoryRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/category`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {string} categoryCode
   * @param {number} page
   * @param {number} countPerPage
   * @return {AxiosResponse<LINETvGetCategoryResponseData>}
   */


  send(channelId, countryCode, categoryCode, page = 1, countPerPage = 10) {
    return this.axios.get(`${this.endpoint}?lineChannelId=${channelId}&country=${countryCode}&categoryCode=${categoryCode}&page=${page}&countPerPage=${countPerPage}`);
  }

}

exports.default = LINETvGetCategoryRequest;
//# sourceMappingURL=linetv-get-category-request.js.map