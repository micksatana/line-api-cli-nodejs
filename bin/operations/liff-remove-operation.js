"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _liffListRequest = _interopRequireDefault(require("../apis/liff-list-request"));

var _liffRemoveRequest = _interopRequireDefault(require("../apis/liff-remove-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LIFFRemoveOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Remove a LIFF app'.help,
      content: `liff remove`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    let apps = [];

    try {
      const response = await this.listRequest.send();
      apps = response.data.apps || [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!apps.length) {
      console.log('LIFF app not found'.info);
      return true;
    }

    const choices = apps.map(app => {
      return {
        title: `${app.view.type} ${app.view.url} [${app.liffId}]`,
        description: app.description,
        value: app.liffId
      };
    });
    const {
      liffId
    } = await prompts({
      type: 'select',
      name: 'liffId',
      message: 'Select a LIFF app to be removed',
      choices
    }, this.cancelOption);

    try {
      await this.removeRequest.send(liffId);
      console.log(`Removed LIFF app ID: ${liffId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = LIFFRemoveOperation;

_defineProperty(LIFFRemoveOperation, "listRequest", new _liffListRequest.default({
  accessToken: LIFFRemoveOperation.config.channel.accessToken
}));

_defineProperty(LIFFRemoveOperation, "removeRequest", new _liffRemoveRequest.default({
  accessToken: LIFFRemoveOperation.config.channel.accessToken
}));
//# sourceMappingURL=liff-remove-operation.js.map