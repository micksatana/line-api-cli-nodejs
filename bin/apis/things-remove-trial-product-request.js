"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsRemoveTrialProductRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }
  /**
   *
   * @param {string} productId Product ID
   */


  send(productId) {
    return this.axios.delete(`${this.endpoint}/${productId}`);
  }

}

exports.default = ThingsRemoveTrialProductRequest;
//# sourceMappingURL=things-remove-trial-product-request.js.map