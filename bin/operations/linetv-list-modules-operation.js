"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _linetvListModulesRequest = _interopRequireDefault(require("../apis/linetv-list-modules-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvListModulesOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'List curation module types'.help,
      content: `linetv list:modules`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const channelId = this.config.channel.id;
    const {
      countryCode
    } = (await prompts({
      type: 'text',
      name: 'countryCode',
      message: 'Country Code?'
    }, this.cancelOption)) || {};

    try {
      /** @type {import('axios').AxiosResponse<LINETvListModulesResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data) {
        console.log('Curation module not found'.info);
        return true;
      }

      const curationModules = response.data.body.supportModule.map(item => {
        const columnHeader = {};
        columnHeader['Name'.success] = item.name;
        columnHeader['Data Model'.success] = item.dataModel;
        return columnHeader;
      });
      console.table(curationModules);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = LINETvListModulesOperation;

_defineProperty(LINETvListModulesOperation, "request", new _linetvListModulesRequest.default({
  accessToken: LINETvListModulesOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-list-modules-operation.js.map