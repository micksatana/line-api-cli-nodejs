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

var _linetvRankingRequest = _interopRequireDefault(require("../apis/linetv-ranking-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvRankingOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Gets clip ranking data.'.help,
      content: `To display clip ranking data in table` + _os.EOL + _os.EOL + `linetv ranking`.code + _os.EOL + _os.EOL + `To get clip ranking data in JSON format, you can run with --format option.` + _os.EOL + _os.EOL + `linetv ranking --format json`.code + _os.EOL + _os.EOL + `To get clip ranking data start from selected page, you can run with --page option.` + _os.EOL + _os.EOL + `linetv ranking --page <number>`.code
    }, {
      header: 'Options',
      optionList: [{
        name: 'format'.code,
        description: 'To display data in JSON format'
      }, {
        name: 'page'.code,
        typeLabel: '{underline number}',
        description: 'To display data starts from selected page'
      }]
    }];
    return sections;
  }

  static validateNonZero(countPerPage) {
    return countPerPage === 0 ? 'Zero is not allowed' : true;
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
    let page = options.page || 1;
    const {
      countryCode
    } = await prompts({
      type: 'text',
      name: 'countryCode',
      message: `Country Code ${'ISO 3166-2'.prompt}`,
      validate: this.validateCountryCode
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
    /** @type {import('axios').AxiosResponse<LINETvRankingResponseData>} */

    let response = await this.request.send(channelId, countryCode, page, countPerPage);

    if (!response.data || response.data.body === null) {
      console.log('Ranking clips not found'.warn);
      return true;
    }

    if (options.format === 'json') {
      console.log(JSON.stringify(response.data, null, 2));
      return true;
    }

    const rankingClips = response.data.body.clips.map(item => {
      const columnHeader = {};
      columnHeader['Clip Number'.success] = item.clipNo;
      columnHeader['Title'.success] = item.clipTitle;
      columnHeader['Play Count'.success] = item.playCount;
      columnHeader['Like Point'.success] = item.likeitPoint;
      return columnHeader;
    });
    console.table(rankingClips);

    while (response.data.body.hasMore) {
      const {
        nextPage
      } = await prompts({
        type: 'toggle',
        name: 'nextPage',
        message: `Current page: ${page}. Go to next page ?`,
        initial: true,
        active: 'yes',
        inactive: 'no'
      }, this.cancelOption);

      if (nextPage) {
        page = page + 1;

        try {
          response = await this.request.send(channelId, countryCode, page, countPerPage);
        } catch (error) {
          this.logAxiosError(error);
          return false;
        }

        console.table(response.data.body.clips.map(item => {
          const columnHeader = {};
          columnHeader['Clip Number'.success] = item.clipNo;
          columnHeader['Title'.success] = item.clipTitle;
          columnHeader['Play Count'.success] = item.playCount;
          columnHeader['Like Point'.success] = item.likeitPoint;
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

exports.default = LINETvRankingOperation;

_defineProperty(LINETvRankingOperation, "request", new _linetvRankingRequest.default({
  accessToken: LINETvRankingOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-ranking-operation.js.map