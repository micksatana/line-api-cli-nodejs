"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuListRequest = _interopRequireDefault(require("../apis/rich-menu-list-request"));

var _richMenuLinkUserRequest = _interopRequireDefault(require("../apis/rich-menu-link-user-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuLinkOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Link a rich menu to a user'.help,
      content: `richmenu link`.code
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
          value: menu
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
    /** @type {{richMenu:RichMenuData}} */


    const {
      richMenu
    } = await prompts({
      type: 'select',
      name: 'richMenu',
      message: 'Select a rich menu for a user',
      choices: richMenus
    }, this.cancelOption);

    if (!richMenu) {
      return false;
    }

    const {
      userId
    } = await prompts({
      type: 'text',
      name: 'userId',
      message: `Link ${richMenu.name} to which user ID`
    }, this.cancelOption);

    if (!userId) {
      return false;
    }

    try {
      await this.linkUserRequest.send(richMenu.richMenuId, userId);
      console.log(`${richMenu.name.code} [${richMenu.richMenuId}] is now visible to user ID ${userId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = RichmenuLinkOperation;

_defineProperty(RichmenuLinkOperation, "listRequest", new _richMenuListRequest.default({
  accessToken: RichmenuLinkOperation.config.channel.accessToken
}));

_defineProperty(RichmenuLinkOperation, "linkUserRequest", new _richMenuLinkUserRequest.default({
  accessToken: RichmenuLinkOperation.config.channel.accessToken
}));
//# sourceMappingURL=richmenu-link-operation.js.map