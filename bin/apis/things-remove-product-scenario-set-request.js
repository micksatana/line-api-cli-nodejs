"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Delete a scenario set registered under a product
 */
class ThingsRemoveProductScenarioSetRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/products`;
  }
  /**
   * @param {string} productId Product ID
   * @return {Promise<import('axios').AxiosResponse>}
   */


  send(productId) {
    return this.axios.delete(`${this.endpoint}/${productId}/scenario-set`);
  }

}

exports.default = ThingsRemoveProductScenarioSetRequest;
//# sourceMappingURL=things-remove-product-scenario-set-request.js.map