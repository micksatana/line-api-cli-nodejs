"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuListRequest = _interopRequireDefault(require("../apis/rich-menu-list-request"));

var _richMenuRemoveRequest = _interopRequireDefault(require("../apis/rich-menu-remove-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuRemoveOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Remove a rich menu'.help,
      content: `richmenu remove`.code
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
      message: 'Select a rich menu to be removed',
      choices: richMenus
    }, this.cancelOption);

    try {
      await this.removeRequest.send(richMenuId);
      console.log(`Removed rich menu ID: ${richMenuId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = RichmenuRemoveOperation;

_defineProperty(RichmenuRemoveOperation, "listRequest", new _richMenuListRequest.default({
  accessToken: RichmenuRemoveOperation.config.channel.accessToken
}));

_defineProperty(RichmenuRemoveOperation, "removeRequest", new _richMenuRemoveRequest.default({
  accessToken: RichmenuRemoveOperation.config.channel.accessToken
}));
//# sourceMappingURL=richmenu-remove-operation.js.map