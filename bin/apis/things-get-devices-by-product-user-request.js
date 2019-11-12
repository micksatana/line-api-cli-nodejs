"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsGetDevicesByProductUserRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
  }
  /**
   *
   * @param {string} productId Product ID
   * @param {string} userId User ID
   */


  send(productId, userId) {
    return this.axios.get(`${this.endpoint}/products/${productId}/users/${userId}/links`);
  }

}

exports.default = ThingsGetDevicesByProductUserRequest;
//# sourceMappingURL=things-get-devices-by-product-user-request.js.map