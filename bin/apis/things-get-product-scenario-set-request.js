"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get the scenario set registered under a product.
 */
class ThingsGetProductScenarioSetRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/products`;
  }
  /**
   * @param {string} productId Product ID
   * @return {Promise<import('axios').AxiosResponse<GetProductScenarioSetResponseData>>}
   */


  send(productId) {
    return this.axios.get(`${this.endpoint}/${productId}/scenario-set`);
  }

}

exports.default = ThingsGetProductScenarioSetRequest;
//# sourceMappingURL=things-get-product-scenario-set-request.js.map