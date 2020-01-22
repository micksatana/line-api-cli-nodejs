"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvLiveRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/live`;
  }
  /**
    * @param {number} channelId
    * @param {string} countryCode
    * @return {AxiosResponse<LINETvListModulesResponseData>}
    */


  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/schedule?lineChannelId=${channelId}&country=${countryCode}`);
  }

}

exports.default = LINETvLiveRequest;
//# sourceMappingURL=linetv-live-request.js.map