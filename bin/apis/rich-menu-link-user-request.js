"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuLinkUserRequest extends _richMenuRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot';
  }

  send(richMenuId, userId) {
    return this.axios.post(`${this.endpoint}/user/${userId}/richmenu/${richMenuId}`);
  }

}

exports.default = RichMenuLinkUserRequest;
//# sourceMappingURL=rich-menu-link-user-request.js.map