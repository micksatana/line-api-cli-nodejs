"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _path = _interopRequireDefault(require("path"));

var _thingsOperation = _interopRequireDefault(require("./things-operation"));

var _thingsUpdateProductScenarioSetRequest = _interopRequireDefault(require("../apis/things-update-product-scenario-set-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ThingsRegisterScenarioSetOperation extends _thingsOperation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Register (create or update) a scenario set for automatic communication under a product'.help,
      content: `things register:scenario-set`.code
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
    /** @type {{ dataFilePath:string }} */


    let {
      dataFilePath
    } = await prompts({
      type: 'text',
      name: 'dataFilePath',
      message: 'Input data file path',
      validate: this.validateFileExists
    }, this.cancelOption);

    if (!dataFilePath) {
      return false;
    }

    if (!_path.default.isAbsolute(dataFilePath)) {
      dataFilePath = _path.default.resolve('./', dataFilePath);
    }

    try {
      const response = await this.request.send(productId, require(dataFilePath));
      this.logAxiosResponse(response);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = ThingsRegisterScenarioSetOperation;

_defineProperty(ThingsRegisterScenarioSetOperation, "request", new _thingsUpdateProductScenarioSetRequest.default({
  accessToken: ThingsRegisterScenarioSetOperation.config.channel.accessToken
}));
//# sourceMappingURL=things-register-scenario-set-operation.js.map