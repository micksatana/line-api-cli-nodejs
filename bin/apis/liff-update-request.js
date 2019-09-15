"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _liffRequest = _interopRequireDefault(require("./liff-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LIFFUpdateRequest extends _liffRequest.default {
  constructor(options) {
    super(options);
  }
  /**
   * @param {string} liffId 
   * @param {LIFFUpdateRequestData} data 
   */


  send(liffId, data) {
    return this.axios.put(`${this.endpoint}/${liffId}`, JSON.stringify(data));
  }

}

exports.default = LIFFUpdateRequest;
//# sourceMappingURL=liff-update-request.js.map