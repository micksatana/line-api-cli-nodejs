"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _thingsGetDeviceRequest = _interopRequireDefault(require("../apis/things-get-device-request"));

var _thingsGetDeviceByDeviceUserRequest = _interopRequireDefault(require("../apis/things-get-device-by-device-user-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsGetDeviceOperation extends _thingsOperation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Get device information by device ID and/or with user ID'.help,
      content: `things get:device`.code
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

    const {
      userId
    } = (await prompts({
      type: 'text',
      name: 'userId',
      message: 'Specific user ID? [Optional]'
    }, this.cancelOption)) || {};

    try {
      const response = userId ? await this.getWithUserRequest.send(deviceId, userId) : await this.getRequest.send(deviceId);
      console.log(response.data);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsGetDeviceOperation;

_defineProperty(ThingsGetDeviceOperation, "getRequest", new _thingsGetDeviceRequest.default({
  accessToken: ThingsGetDeviceOperation.config.channel.accessToken
}));

_defineProperty(ThingsGetDeviceOperation, "getWithUserRequest", new _thingsGetDeviceByDeviceUserRequest.default({
  accessToken: ThingsGetDeviceOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-get-device-operation.js.map