"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

require("console.table");

var _commandLineUsage = require("command-line-usage");

var _operation = _interopRequireDefault(require("./operation"));

var _os = require("os");

var _linetvListStationRequest = _interopRequireDefault(require("../apis/linetv-list-station-request"));

var _linetvGetStationRequest = _interopRequireDefault(require("../apis/linetv-get-station-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvGetStationOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Gets the Station Home (TV Station) data'.help,
      content: `To display station dat in table` + _os.EOL + _os.EOL + `linetv get:station`.code + _os.EOL + _os.EOL + `To get station data in JSON format, you can run with --format option.` + _os.EOL + _os.EOL + `linetv get:station --format json`.code + _os.EOL + _os.EOL + `To get station data start from selected page, you can run with --page option.` + _os.EOL + _os.EOL + `linetv get:station --page <number>`.code
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
    } = await prompts({
      type: 'text',
      name: 'countryCode',
      message: `Country Code ${'ISO 3166-2'.prompt}`,
      validate: this.validateCountryCode
    }, this.cancelOption);
    let stations = [];

    try {
      /** @type {import('axios').AxiosResponse<LINETvListStationResponseData>} */
      const listResponse = await this.listRequest.send(channelId, countryCode);

      if (!listResponse.data || listResponse.data.body === null) {
        console.log('Station data not found'.warn);
        return true;
      }

      stations = listResponse.data.body.stations.map(menu => {
        return {
          title: menu.stationId,
          description: menu.stationName,
          value: menu
        };
      });
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    if (!stations.length) {
      console.log('No Stations Home Data'.warn);
      return true;
    }

    let page = options.page || 1;
    const {
      selectedStation
    } = await prompts({
      type: 'select',
      name: 'selectedStation',
      message: 'Select a category',
      choices: stations
    }, this.cancelOption);
    /** @type {import('axios').AxiosResponse<LINETvGetStationResponseData>} */

    let getResponse = await this.getRequest.send(channelId, countryCode, selectedStation.stationId, page);

    if (options.format === 'json') {
      console.log(JSON.stringify(getResponse.data, null, 2));
      return true;
    }

    console.table(getResponse.data.body.popularClip.clips.map(item => {
      const columnHeader = {};
      columnHeader['Clip Number'.success] = item.clipNo;
      columnHeader['Title'.success] = item.clipTitle;
      columnHeader['Play Count'.success] = item.playCount;
      columnHeader['Like Point'.success] = item.likeitPoint;
      columnHeader['URL'.success] = item.serviceUrl;
      return columnHeader;
    }));
    console.table(getResponse.data.body.popularChannel.channels.map(item => {
      const columnHeader = {};
      columnHeader['Channel ID'.success] = item.channelId;
      columnHeader['Channel Name'.success] = item.channelName;
      columnHeader['Badge'.success] = item.badgeType;
      columnHeader['URL'.success] = item.serviceUrl;
      return columnHeader;
    }));

    while (getResponse.data.body.popularClip.hasMore) {
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
          getResponse = await this.getRequest.send(channelId, countryCode, selectedStation.stationId, page);
        } catch (error) {
          this.logAxiosError(error);
          return false;
        }

        console.table(getResponse.data.body.popularClip.clips.map(item => {
          const columnHeader = {};
          columnHeader['Popular Clip Number'.success] = item.clipNo;
          columnHeader['Title'.success] = item.clipTitle;
          columnHeader['Play Count'.success] = item.playCount;
          columnHeader['Like Point'.success] = item.likeitPoint;
          columnHeader['URL'.success] = item.serviceUrl;
          return columnHeader;
        }));
        console.table(getResponse.data.body.popularChannel.channels.map(item => {
          const columnHeader = {};
          columnHeader['Popular Channel ID'.success] = item.channelId;
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

exports.default = LINETvGetStationOperation;

_defineProperty(LINETvGetStationOperation, "listRequest", new _linetvListStationRequest.default({
  accessToken: LINETvGetStationOperation.config.channel.accessToken
}));

_defineProperty(LINETvGetStationOperation, "getRequest", new _linetvGetStationRequest.default({
  accessToken: LINETvGetStationOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-get-station-operation.js.map