"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _liffRequest = _interopRequireDefault(require("./liff-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LIFFListRequest extends _liffRequest.default {
  constructor(options) {
    super(options);
  }
  /**
   * @return {import('axios').AxiosResponse<LIFFListResponseData>}
   */


  send() {
    return this.axios.get(this.endpoint);
  }

}

exports.default = LIFFListRequest;
//# sourceMappingURL=liff-list-request.js.map