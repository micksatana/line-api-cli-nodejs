"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thingsRequest = _interopRequireDefault(require("./things-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsGetDeviceByDeviceUserRequest extends _thingsRequest.default {
  constructor(options) {
    super(options);
  }
  /**
   *
   * @param {string} deviceId Device ID
   * @param {string} userId User ID
   */


  send(deviceId, userId) {
    return this.axios.get(`${this.endpoint}/devices/${deviceId}/users/${userId}/links`);
  }

}

exports.default = ThingsGetDeviceByDeviceUserRequest;
//# sourceMappingURL=things-get-device-by-device-user-request.js.map