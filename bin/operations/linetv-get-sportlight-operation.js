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

var _linetvGetSportlightRequest = _interopRequireDefault(require("../apis/linetv-get-sportlight-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETvGetSpotlightOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Gets spotlight data'.help,
      content: `To display spotlight data in table` + _os.EOL + _os.EOL + `linetv get:spotlight`.code + _os.EOL + _os.EOL + `To get spotlight data in JSON format, you can run with --format option.` + _os.EOL + _os.EOL + `linetv get:sportlight --format json`.code
    }, {
      header: 'Options',
      optionList: [{
        name: 'format'.code,
        description: 'To display data in JSON format'
      }]
    }];
    return sections;
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
      message: 'Country Code?'
    }, this.cancelOption)) || {};
    let modules = [];

    try {
      const listResponse = await this.listRequest.send(channelId, countryCode);
      modules = listResponse.data.body.supportModule ? listResponse.data.body.supportModule.map(menu => {
        return {
          title: menu.name,
          description: menu.dataModel,
          value: menu
        };
      }) : [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!modules.length) {
      console.log('Modules not found'.info);
      return true;
    }

    const {
      menu
    } = await prompts({
      type: 'select',
      name: 'menu',
      message: 'Select a module',
      choices: modules
    }, this.cancelOption);
    const getResponse = await this.getRequest.send(channelId, countryCode, menu.name);

    if (options.format === 'json') {
      console.log(JSON.stringify(getResponse.data, null, 2));
      return true;
    }

    let rows;

    if (!getResponse.data.body) {
      rows = [];
    } else {
      switch (menu.dataModel) {
        case 'clip':
          rows = getResponse.data.body.clips ? getResponse.data.body.clips.map(item => {
            const columnHeader = {};
            columnHeader['Clip Number'.success] = item.clipNo;
            columnHeader['Title'.success] = item.clipTitle;
            columnHeader['Play Count'.success] = item.playCount;
            columnHeader['Like Point'.success] = item.likeitPoint;
            return columnHeader;
          }) : [];
          break;

        case 'channel':
          rows = getResponse.data.body.channels ? getResponse.data.body.channels.map(item => {
            const columnHeader = {};
            columnHeader['Channel ID'.success] = item.channelId;
            columnHeader['Channel Name'.success] = item.channelName;
            columnHeader['URL'.success] = item.serviceUrl;
            return columnHeader;
          }) : [];
          break;

        case 'playlist':
          rows = getResponse.data.body.playlists ? getResponse.data.body.playlists.map(item => {
            const columnHeader = {};
            columnHeader['Title'.success] = item.title;
            columnHeader['Subtitle'.success] = item.subtitle;
            columnHeader['Play List Count'.success] = item.playlists.length;
            return columnHeader;
          }) : [];
          break;

        default:
          console.error('Data model not implemented');
          return false;
      }
    }

    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('Data not found'.warn);
    }

    return true;
  }

}

exports.default = LINETvGetSpotlightOperation;

_defineProperty(LINETvGetSpotlightOperation, "listRequest", new _linetvListModulesRequest.default({
  accessToken: LINETvGetSpotlightOperation.config.channel.accessToken
}));

_defineProperty(LINETvGetSpotlightOperation, "getRequest", new _linetvGetSportlightRequest.default({
  accessToken: LINETvGetSpotlightOperation.config.channel.accessToken
}));
//# sourceMappingURL=linetv-get-sportlight-operation.js.map