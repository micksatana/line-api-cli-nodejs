"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _thingsListTrialProductsRequest = _interopRequireDefault(require("../apis/things-list-trial-products-request"));

var _thingsRemoveTrialProductRequest = _interopRequireDefault(require("../apis/things-remove-trial-product-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsRemoveTrialOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Remove a trial product'.help,
      content: `things remove:trial`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    let trialProducts;

    try {
      const response = await this.listRequest.send();
      trialProducts = response.data;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (trialProducts && trialProducts.length) {
      trialProducts = trialProducts.map(product => {
        return {
          title: `${product.name}`,
          description: `Product ID: ${product.id}`,
          value: product.id
        };
      });
    } else {
      console.log('Trial product not found'.info);
      return true;
    }

    const {
      productId
    } = await prompts({
      type: 'select',
      name: 'productId',
      message: 'Select a trial product to be removed',
      choices: trialProducts
    }, this.cancelOption);

    try {
      await this.removeRequest.send(productId);
      console.log(`Removed trial product ID: ${productId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsRemoveTrialOperation;

_defineProperty(ThingsRemoveTrialOperation, "listRequest", new _thingsListTrialProductsRequest.default({
  accessToken: ThingsRemoveTrialOperation.config.channel.accessToken
}));

_defineProperty(ThingsRemoveTrialOperation, "removeRequest", new _thingsRemoveTrialProductRequest.default({
  accessToken: ThingsRemoveTrialOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-remove-trial-operation.js.map