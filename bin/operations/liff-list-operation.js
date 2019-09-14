"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _liffListRequest = _interopRequireDefault(require("../apis/liff-list-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LIFFListOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'List LIFF apps'.help,
      content: `liff list`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let apps;

    try {
      const response = await this.listRequest.send();
      apps = response.data.apps;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!apps || apps.length === 0) {
      console.log('LIFF app not found'.info);
      return true;
    }

    console.table(apps.map(app => {
      const row = {};
      row['LIFF app ID'.success] = app.liffId;
      row['Type'.success] = app.view.type;
      row['URL'.success] = app.view.url;
      row['Description'.success] = app.description;
      row['BLE'.success] = app.features && app.features.ble ? '\u2713' : '\u2715';
      return row;
    }));
    return true;
  }

}

exports.default = LIFFListOperation;

_defineProperty(LIFFListOperation, "listRequest", new _liffListRequest.default({
  accessToken: LIFFListOperation.config.channel.accessToken
}));
//# sourceMappingURL=liff-list-operation.js.map