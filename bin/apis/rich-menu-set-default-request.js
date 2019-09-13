"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuSetDefaultRequest extends _richMenuRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot/user/all/richmenu';
  }

  send(richMenuId) {
    return this.axios.post(`${this.endpoint}/${richMenuId}`);
  }

}

exports.default = RichMenuSetDefaultRequest;
//# sourceMappingURL=rich-menu-set-default-request.js.map