"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _thingsListTrialProductsRequest = _interopRequireDefault(require("../apis/things-list-trial-products-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsListTrialOperation extends _thingsOperation.default {
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
      console.table(_thingsOperation.default.productsToTableData(trialProducts));
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