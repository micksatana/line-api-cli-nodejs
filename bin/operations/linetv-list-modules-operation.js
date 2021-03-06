"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _os = require("os");

var _operation = _interopRequireDefault(require("./operation"));

var _linetvListModulesRequest = _interopRequireDefault(require("../apis/linetv-list-modules-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvListModulesOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'List curation module types'.help,
      content: `To display curation module types in table` + _os.EOL + _os.EOL + `linetv list:modules`.code + _os.EOL + _os.EOL + `To get curation module types data in JSON format, you can run with --format option.` + _os.EOL + _os.EOL + `linetv list:modules --format json`.code
    }, {
      header: 'Options',
      optionList: [{
        name: 'format'.code,
        description: 'To get data in JSON format'
      }]
    }];
    return sections;
  }

  static validateCountryCode(countryCode) {
    return countryCode.length !== 2 ? 'Please input ISO 3166-2 (2 characters)' : true;
  }

  static async run(options) {
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
      message: `Country Code ${'ISO 3166-2'.prompt}`,
      validate: this.validateCountryCode
    }, this.cancelOption)) || {};

    try {
      /** @type {import('axios').AxiosResponse<LINETvListModulesResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data) {
        console.log('Curation module not found'.info);
        return true;
      }

      if (options.format === 'json') {
        console.log(JSON.stringify(response.data, null, 2));
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