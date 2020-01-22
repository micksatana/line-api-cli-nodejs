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

var _linetvGetCategoryRequest = _interopRequireDefault(require("../apis/linetv-get-category-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvGetCategoryOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Gets category home data.'.help,
      content: `linetv get:category`.code
    }];
    return sections;
  }

  static validateNonZero(countPerPage) {
    return countPerPage === 0 ? 'Zero is not allowed' : true;
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
    let categories = [];

    try {
      const listResponse = await this.listRequest.send(channelId, countryCode);

      if (!listResponse.data || listResponse.data.body === null) {
        console.log('Category list not found'.warn);
        return true;
      }

      categories = listResponse.data.body.tabs ? listResponse.data.body.tabs.map(menu => {
        return {
          title: menu.categoryCode,
          description: menu.categoryName,
          value: menu
        };
      }) : [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!categories.length) {
      console.log('No category'.warn);
      return true;
    }

    let page = 1;
    const {
      selectedCategory
    } = await prompts({
      type: 'select',
      name: 'selectedCategory',
      message: 'Select a category',
      choices: categories
    }, this.cancelOption);
    const {
      countPerPage
    } = await prompts({
      type: 'number',
      name: 'countPerPage',
      message: 'Number of display per page?',
      initial: 10,
      validate: this.validateNonZero
    }, this.cancelOption);
    let getResponse = await this.getRequest.send(channelId, countryCode, selectedCategory.categoryCode, page, countPerPage);
    const clip = getResponse.data.body.representClip;
    const representClip = [{
      ' ': 'Represent Clip No.'.success,
      '  ': clip.clipNo
    }, {
      ' ': 'Represent Clip Title.'.success,
      '  ': clip.clipTitle
    }, {
      ' ': 'Represent Clip URL'.success,
      '  ': clip.serviceUrl
    }, {
      ' ': 'Play Count'.success,
      '  ': clip.playCount
    }, {
      ' ': 'Likeit Count'.success,
      '  ': clip.likeitPoint
    }];
    console.table(representClip);
    console.table(getResponse.data.body.channels.map(item => {
      const columnHeader = {};
      columnHeader['Channel ID'.success] = item.channelId;
      columnHeader['Channel Name'.success] = item.channelName;
      columnHeader['Badge'.success] = item.badgeType;
      columnHeader['URL'.success] = item.serviceUrl;
      return columnHeader;
    }));

    while (getResponse.data.body.hasMore) {
      const {
        nextPage
      } = await prompts({
        type: 'toggle',
        name: 'nextPage',
        message: 'Next Page ?',
        initial: true,
        active: 'yes',
        inactive: 'no'
      }, this.cancelOption);

      if (nextPage) {
        page = page + 1;

        try {
          getResponse = await this.getRequest.send(channelId, countryCode, selectedCategory.categoryCode, page, countPerPage);
        } catch (error) {
          this.logAxiosError(error);
          return false;
        }

        console.table(getResponse.data.body.channels.map(item => {
          const columnHeader = {};
          columnHeader['Channel ID'.success] = item.channelId;
          columnHeader['Channel Name'.success] = item.channelName;
          columnHeader['Badge'.success] = item.badgeType;
          columnHeader['URL'.success] = item.serviceUrl;
          return columnHeader;
        }));
      } else {
        return true;
      }
    }

    console.log('No more page'.info);
    return true;
  }

}

exports.default = LINETvGetCategoryOperation;

_defineProperty(LINETvGetCategoryOperation, "listRequest", new _linetvListCatagoryRequest.default({
  accessToken: LINETvGetCategoryOperation.config.channel.accessToken
}));

_defineProperty(LINETvGetCategoryOperation, "getRequest", new _linetvGetCategoryRequest.default({
  accessToken: LINETvGetCategoryOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-get-category-operation.js.map