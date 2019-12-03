"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _thingsRemoveProductScenarioSetRequest = _interopRequireDefault(require("../apis/things-remove-product-scenario-set-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsRemoveScenarioSetOperation extends _thingsOperation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Delete a scenario set registered under a product'.help,
      content: `things remove:scenario-set`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const {
      productId
    } = await prompts({
      type: 'text',
      name: 'productId',
      message: 'Product ID?'
    }, this.cancelOption);

    if (!productId) {
      return false;
    }

    try {
      const response = await this.request.send(productId);
      this.logAxiosResponse(response);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsRemoveScenarioSetOperation;

_defineProperty(ThingsRemoveScenarioSetOperation, "request", new _thingsRemoveProductScenarioSetRequest.default({
  accessToken: ThingsRemoveScenarioSetOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-remove-scenario-set-operation.js.map