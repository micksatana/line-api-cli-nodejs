"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Register (create or update) a scenario set for automatic communication under a product.
 */
class ThingsUpdateProductScenarioSetRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/products`;
  }
  /**
   * @param {string} productId Product ID
   * @param {UpdateProductScenarioSetRequestData} data
   * @return {Promise<import('axios').AxiosResponse<UpdateProductScenarioSetResponseData>>}
   */


  send(productId, data) {
    return this.axios.put(`${this.endpoint}/${productId}/scenario-set`, data);
  }

}

exports.default = ThingsUpdateProductScenarioSetRequest;
//# sourceMappingURL=things-update-product-scenario-set-request.js.map