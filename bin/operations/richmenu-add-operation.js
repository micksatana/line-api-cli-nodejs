"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuAddRequest = _interopRequireDefault(require("../apis/rich-menu-add-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuAddOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Add a rich menu'.help,
      content: `richmenu add`.code
    }];
    return sections;
  }

  static async run() {
    return true;
  }

}

exports.default = RichmenuAddOperation;

_defineProperty(RichmenuAddOperation, "request", new _richMenuAddRequest.default());
//# sourceMappingURL=richmenu-add-operation.js.map