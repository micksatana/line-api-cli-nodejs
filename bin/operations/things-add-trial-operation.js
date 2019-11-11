"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _liffListRequest = _interopRequireDefault(require("../apis/liff-list-request"));

var _thingsAddTrialRequest = _interopRequireDefault(require("../apis/things-add-trial-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsAddTrialOperation extends _thingsOperation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Add a trial product'.help,
      content: `things add:trial`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

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

    const prompts = require('prompts');

    const {
      liffId
    } = await prompts({
      type: 'select',
      name: 'liffId',
      message: 'Select a LIFF app to add a trial product',
      choices
    }, this.cancelOption);
    const {
      productName
    } = await prompts({
      type: 'text',
      name: 'productName',
      message: 'Product name?'
    }, this.cancelOption);

    try {
      const response = await this.addRequest.send(liffId, productName);
      console.table(_thingsOperation.default.productsToTableData([response.data]));
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsAddTrialOperation;

_defineProperty(ThingsAddTrialOperation, "listRequest", new _liffListRequest.default({
  accessToken: ThingsAddTrialOperation.config.channel.accessToken
}));

_defineProperty(ThingsAddTrialOperation, "addRequest", new _thingsAddTrialRequest.default({
  accessToken: ThingsAddTrialOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-add-trial-operation.js.map