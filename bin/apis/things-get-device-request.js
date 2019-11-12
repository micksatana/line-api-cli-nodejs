"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsGetDeviceRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
  }
  /**
   *
   * @param {string} deviceId Device ID
   */


  send(deviceId) {
    return this.axios.get(`${this.endpoint}/devices/${deviceId}`);
  }

}

exports.default = ThingsGetDeviceRequest;
//# sourceMappingURL=things-get-device-request.js.map