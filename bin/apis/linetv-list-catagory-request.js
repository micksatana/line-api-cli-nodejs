"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvListCategoryRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/category`;
  }
  /**
    * @param {number} channelId
    * @param {string} countryCode
    * @return {AxiosResponse<LINETvListCategoryResponseData>}
    */


  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/list?lineChannelId=${channelId}&country=${countryCode}`);
  }

}

exports.default = LINETvListCategoryRequest;
//# sourceMappingURL=linetv-list-catagory-request.js.map