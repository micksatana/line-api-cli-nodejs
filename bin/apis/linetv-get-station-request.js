"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linetvRequest = _interopRequireDefault(require("./linetv-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvGetStationRequest extends _linetvRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/station`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {string} stationId
   * @param {number} page
   * @return {AxiosResponse<LINETvGetStationResponseData>}
   */


  send(channelId, countryCode, stationId, page = 1) {
    return this.axios.get(`${this.endpoint}?lineChannelId=${channelId}&country=${countryCode}&stationId=${stationId}&page=${page}`);
  }

}

exports.default = LINETvGetStationRequest;
//# sourceMappingURL=linetv-get-station-request.js.map