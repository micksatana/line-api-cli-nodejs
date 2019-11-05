"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _thingsListTrialProductsRequest = _interopRequireDefault(require("../apis/things-list-trial-products-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsListTrialOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'List trial products'.help,
      content: `things list:trial`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let trialProducts;

    try {
      const response = await this.listRequest.send();
      trialProducts = response.data;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (trialProducts && trialProducts.length) {
      console.table(trialProducts.map(product => {
        const row = {};
        row['ID'.success] = product.id;
        row['Name'.success] = product.name;
        row['Type'.success] = product.type;
        row['Channel ID'.success] = product.channelId;
        row['Service UUID'.success] = product.serviceUuid;
        row['PSDI Service UUID'.success] = product.psdiServiceUuid;
        row['PSDI Characteristic UUID'.success] = product.psdiCharacteristicUuid;
        return row;
      }));
    } else {
      console.log('Trial product not found'.info);
      return true;
    }

    return true;
  }

}

exports.default = ThingsListTrialOperation;

_defineProperty(ThingsListTrialOperation, "listRequest", new _thingsListTrialProductsRequest.default({
  accessToken: ThingsListTrialOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-list-trial-operation.js.map