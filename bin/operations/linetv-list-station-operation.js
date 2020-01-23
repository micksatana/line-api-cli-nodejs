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

var _linetvListStationRequest = _interopRequireDefault(require("../apis/linetv-list-station-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvListStationOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Gets the station home (TV station) list'.help,
      content: `To display station home in table` + _os.EOL + _os.EOL + `linetv list:station`.code + _os.EOL + _os.EOL + `To get station home data in JSON format, you can run with --format option.` + _os.EOL + _os.EOL + `linetv list:station --format json`.code
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
    } = await prompts({
      type: 'text',
      name: 'countryCode',
      message: `Country Code ${'ISO 3166-2'.prompt}`,
      validate: this.validateCountryCode
    }, this.cancelOption);

    try {
      /** @type {import('axios').AxiosResponse<LINETvListStationResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data || response.data.body === null) {
        console.log('No station home data'.warn);
        return true;
      }

      if (options.format === 'json') {
        console.log(JSON.stringify(response.data, null, 2));
        return true;
      }

      const stations = response.data.body.stations.map(item => {
        const columnHeader = {};
        columnHeader['Station ID'.success] = item.stationId;
        columnHeader['Station Name'.success] = item.stationName;
        columnHeader['Station URL'.success] = item.serviceUrl;
        return columnHeader;
      });
      console.table(stations);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }

}

exports.default = LINETvListStationOperation;

_defineProperty(LINETvListStationOperation, "request", new _linetvListStationRequest.default({
  accessToken: LINETvListStationOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-list-station-operation.js.map