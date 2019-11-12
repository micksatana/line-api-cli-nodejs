"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsAddTrialRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }
  /**
   *
   * @param {string} liffId LIFF ID
   * @param {string} name Product name
   */


  send(liffId, name) {
    return this.axios.post(this.endpoint, JSON.stringify({
      liffId,
      name
    }));
  }

}

exports.default = ThingsAddTrialRequest;
//# sourceMappingURL=things-add-trial-request.js.map