"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _liffRequest = _interopRequireDefault(require("./liff-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LIFFAddRequest extends _liffRequest.default {
  constructor(options) {
    super(options);
  }

  send(data) {
    return this.axios.post(this.endpoint, JSON.stringify(data));
  }

}

exports.default = LIFFAddRequest;
//# sourceMappingURL=liff-add-request.js.map