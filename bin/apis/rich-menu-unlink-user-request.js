"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuUnlinkUserRequest extends _richMenuRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot';
  }

  send(userId) {
    return this.axios.delete(`${this.endpoint}/user/${userId}/richmenu`);
  }

}

exports.default = RichMenuUnlinkUserRequest;
//# sourceMappingURL=rich-menu-unlink-user-request.js.map