"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _thingsGetDeviceRequest = _interopRequireDefault(require("../apis/things-get-device-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsGetProductOperation extends _thingsOperation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Specify the device ID, and acquire the product ID and PSDI'.help,
      content: `things get:product`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const {
      deviceId
    } = (await prompts({
      type: 'text',
      name: 'deviceId',
      message: 'Device ID?'
    }, this.cancelOption)) || {};

    if (!deviceId) {
      console.log('Device ID cannot be empty'.error);
      return false;
    }

    try {
      const response = await this.getRequest.send(deviceId);
      console.log(response.data);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsGetProductOperation;

_defineProperty(ThingsGetProductOperation, "getRequest", new _thingsGetDeviceRequest.default({
  accessToken: ThingsGetProductOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-get-product-operation.js.map