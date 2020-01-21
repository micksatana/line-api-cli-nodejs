"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvListStationRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/station`;
  }
  /**
    * @param {number} channelId
    * @param {string} channelCode
    * @return {AxiosResponse<LINETvListStationResponseData>}
    */


  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/list?lineChannelId=${channelId}&country=${countryCode}`);
  }

}

exports.default = LINETvListStationRequest;
//# sourceMappingURL=linetv-list-station-request.js.map