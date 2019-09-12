"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuAddRequest extends _richMenuRequest.default {
  constructor(options) {
    super(options);
  }

  send(data) {
    return this.axios.post(this.endpoint, JSON.stringify(data));
  }

}

exports.default = RichMenuAddRequest;
//# sourceMappingURL=rich-menu-add-request.js.map