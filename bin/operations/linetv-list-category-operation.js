"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _linetvListCatagoryRequest = _interopRequireDefault(require("../apis/linetv-list-catagory-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvListCategoryOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Gets a category list such as drama, music, etc.'.help,
      content: `linetv list:category`.code
    }];
    return sections;
  }

  static validateCountryCode(countryCode) {
    return countryCode.length !== 2 ? 'Please input ISO 3166-2 (2 characters)' : true;
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
      message: `Country Code ${'ISO 3166-2'.prompt}`,
      validate: this.validateCountryCode
    }, this.cancelOption)) || {};

    try {
      /** @type {import('axios').AxiosResponse<LINETvListCategoryResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data || response.data.body === null) {
        console.log('Category list not found'.info);
        return true;
      }

      const CategoryList = response.data.body.tabs.map(item => {
        const columnHeader = {};
        columnHeader['Category'.success] = item.categoryName;
        columnHeader['Category Code'.success] = item.categoryCode;
        columnHeader['URL'.success] = item.serviceUrl;
        return columnHeader;
      });
      console.table(CategoryList);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = LINETvListCategoryOperation;

_defineProperty(LINETvListCategoryOperation, "request", new _linetvListCatagoryRequest.default({
  accessToken: LINETvListCategoryOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-list-category-operation.js.map