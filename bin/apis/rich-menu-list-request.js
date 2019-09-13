"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuListRequest extends _richMenuRequest.default {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/list`;
  }
  /**
   * @return {import('axios').AxiosResponse<RichmenuListResponseData>}
   */


  send() {
    return this.axios.get(this.endpoint);
  }

}

exports.default = RichMenuListRequest;
//# sourceMappingURL=rich-menu-list-request.js.map