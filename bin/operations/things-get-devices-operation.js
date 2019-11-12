"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _thingsGetDevicesByProductUserRequest = _interopRequireDefault(require("../apis/things-get-devices-by-product-user-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsGetDevicesOperation extends _thingsOperation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Get device information by product ID and user ID'.help,
      content: `things get:devices`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const {
      productId
    } = (await prompts({
      type: 'text',
      name: 'productId',
      message: 'Product ID?'
    }, this.cancelOption)) || {};

    if (!productId) {
      console.log('Product ID cannot be empty'.error);
      return false;
    }

    const {
      userId
    } = (await prompts({
      type: 'text',
      name: 'userId',
      message: 'User ID?'
    }, this.cancelOption)) || {};

    if (!userId) {
      console.log('User ID cannot be empty'.error);
      return false;
    }

    try {
      const response = await this.getRequest.send(productId, userId);
      console.log(response.data.items);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsGetDevicesOperation;

_defineProperty(ThingsGetDevicesOperation, "getRequest", new _thingsGetDevicesByProductUserRequest.default({
  accessToken: ThingsGetDevicesOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-get-devices-operation.js.map