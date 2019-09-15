"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _liffRequest = _interopRequireDefault(require("./liff-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LIFFRemoveRequest extends _liffRequest.default {
  constructor(options) {
    super(options);
  }

  send(liffId) {
    return this.axios.delete(`${this.endpoint}/${liffId}`);
  }

}

exports.default = LIFFRemoveRequest;
//# sourceMappingURL=liff-remove-request.js.map