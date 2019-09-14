"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuListRequest = _interopRequireDefault(require("../apis/rich-menu-list-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuListOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'List rich menus'.help,
      content: `richmenu list`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let richMenus;

    try {
      const response = await this.listRequest.send();
      richMenus = response.data.richmenus;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!richMenus || richMenus.length === 0) {
      console.log('Rich menu not found'.info);
      return true;
    }

    console.table(richMenus.map(menu => {
      const row = {};
      row['Rich menu ID'.success] = menu.richMenuId;
      row['Name'.success] = menu.name;
      row['Bar text'.success] = menu.chatBarText;
      row['Size'.success] = `${menu.size.width}x${menu.size.height}`;
      row['No. of Areas'.success] = menu.areas.length;
      row['Selected'.success] = menu.selected;
      return row;
    }));
    return true;
  }

}

exports.default = RichmenuListOperation;

_defineProperty(RichmenuListOperation, "listRequest", new _richMenuListRequest.default({
  accessToken: RichmenuListOperation.config.channel.accessToken
}));
//# sourceMappingURL=richmenu-list-operation.js.map