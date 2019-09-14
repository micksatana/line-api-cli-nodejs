"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuUnlinkUserRequest = _interopRequireDefault(require("../apis/rich-menu-unlink-user-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuUnlinkOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Unlink user-specific rich menu'.help,
      content: `richmenu unlink`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const {
      userId
    } = await prompts({
      type: 'text',
      name: 'userId',
      message: `Unlink menu from which user ID`
    }, this.cancelOption);

    if (!userId) {
      return false;
    }

    try {
      await this.unlinkUserRequest.send(userId);
      console.log(`Unlinked menu from user ID ${userId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = RichmenuUnlinkOperation;

_defineProperty(RichmenuUnlinkOperation, "unlinkUserRequest", new _richMenuUnlinkUserRequest.default({
  accessToken: RichmenuUnlinkOperation.config.channel.accessToken
}));
//# sourceMappingURL=richmenu-unlink-operation.js.map