"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuListRequest = _interopRequireDefault(require("../apis/rich-menu-list-request"));

var _richMenuSetDefaultRequest = _interopRequireDefault(require("../apis/rich-menu-set-default-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuSetDefaultOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Set a rich menu as default for all users'.help,
      content: `richmenu default`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    let richMenus = [];

    try {
      const response = await this.listRequest.send();
      richMenus = response.data.richmenus ? response.data.richmenus.map(menu => {
        return {
          title: `${menu.name} [${menu.richMenuId}]`,
          description: `${menu.chatBarText} has ${menu.areas.length} areas`,
          value: menu.richMenuId
        };
      }) : [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!richMenus.length) {
      console.log('Rich menu not found'.info);
      return true;
    }

    const {
      richMenuId
    } = await prompts({
      type: 'select',
      name: 'richMenuId',
      message: 'Select a rich menu as default for all users',
      choices: richMenus
    }, this.cancelOption);

    try {
      await this.setDefaultRequest.send(richMenuId);
      console.log(`${richMenuId.code} set as default rich menu`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = RichmenuSetDefaultOperation;

_defineProperty(RichmenuSetDefaultOperation, "listRequest", new _richMenuListRequest.default({
  accessToken: RichmenuSetDefaultOperation.config.channel.accessToken
}));

_defineProperty(RichmenuSetDefaultOperation, "setDefaultRequest", new _richMenuSetDefaultRequest.default({
  accessToken: RichmenuSetDefaultOperation.config.channel.accessToken
}));
//# sourceMappingURL=richmenu-set-default-operation.js.map