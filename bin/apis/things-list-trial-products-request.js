"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsListTrialProductsRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }

  send() {
    return this.axios.get(this.endpoint);
  }

}

exports.default = ThingsListTrialProductsRequest;
//# sourceMappingURL=things-list-trial-products-request.js.map