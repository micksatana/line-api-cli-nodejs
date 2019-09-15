"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _commandLineUsage = require("command-line-usage");

var _os = require("os");

var _operation = _interopRequireDefault(require("./operation"));

var _liffUpdateRequest = _interopRequireDefault(require("../apis/liff-update-request"));

var _liffListRequest = _interopRequireDefault(require("../apis/liff-list-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LIFFUpdateOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Update a LIFF view'.help,
      content: `liff update`.code
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
        value: app
      };
    });

    const prompts = require('prompts');
    /** @type {{app:LIFFAppData}} */


    const {
      app
    } = await prompts({
      type: 'select',
      name: 'app',
      message: 'Select a LIFF app to be updated',
      choices
    }, this.cancelOption);

    if (!app) {
      return false;
    }

    const viewTypes = [{
      title: 'compact',
      description: '50% of device screen height',
      value: 'compact'
    }, {
      title: 'tall',
      description: '80% of device screen height',
      value: 'tall'
    }, {
      title: 'full',
      description: '100% of device screen height',
      value: 'full'
    }];
    const {
      viewType
    } = await prompts({
      type: 'select',
      name: 'viewType',
      message: 'Select view type',
      choices: viewTypes,
      initial: viewTypes.reduce((init, type, i) => {
        if (type.value === app.view.type) {
          init = i;
        }

        return init;
      }, 0)
    }, this.cancelOption);

    if (!viewType) {
      return false;
    }

    const {
      viewUrl
    } = await prompts({
      type: 'text',
      name: 'viewUrl',
      message: 'View URL',
      initial: app.view.url
    }, this.cancelOption);

    if (!viewUrl) {
      return false;
    }

    const {
      description
    } = await prompts({
      type: 'text',
      name: 'description',
      message: 'View description',
      initial: app.description
    }, this.cancelOption);

    if (!description) {
      return false;
    }

    const {
      ble
    } = await prompts({
      type: 'toggle',
      name: 'ble',
      message: 'Is this LIFF app supports Bluetooth® Low Energy for LINE Things',
      initial: app.features && app.features.ble ? true : false,
      active: 'Yes',
      inactive: 'No'
    }, this.cancelOption);

    if (typeof ble === 'undefined') {
      return false;
    }

    const data = {
      view: {
        type: viewType,
        url: viewUrl
      },
      description,
      features: {
        ble
      }
    };

    try {
      await this.updateRequest.send(app.liffId, data);
      const row = {};
      row['LIFF app ID'.success] = app.liffId;
      row['Type'.success] = data.view.type;
      row['URL'.success] = data.view.url;
      row['Description'.success] = data.description;
      row['BLE'.success] = data.features && data.features.ble ? '\u2713' : '\u2715';
      console.log(_os.EOL);
      console.table([row]);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = LIFFUpdateOperation;

_defineProperty(LIFFUpdateOperation, "listRequest", new _liffListRequest.default({
  accessToken: LIFFUpdateOperation.config.channel.accessToken
}));

_defineProperty(LIFFUpdateOperation, "updateRequest", new _liffUpdateRequest.default({
  accessToken: LIFFUpdateOperation.config.channel.accessToken
}));
//# sourceMappingURL=liff-update-operation.js.map