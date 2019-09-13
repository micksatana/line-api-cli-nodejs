"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuRemoveRequest extends _richMenuRequest.default {
  constructor(options) {
    super(options);
  }

  send(richMenuId) {
    return this.axios.delete(`${this.endpoint}/${richMenuId}`);
  }

}

exports.default = RichMenuRemoveRequest;
//# sourceMappingURL=rich-menu-remove-request.js.map