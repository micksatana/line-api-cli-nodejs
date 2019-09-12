"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commandLineUsage = require("command-line-usage");

var _fs = _interopRequireDefault(require("fs"));

var _os = require("os");

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _operation = _interopRequireDefault(require("./operation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINEInitOperation extends _operation.default {
  static get usage() {
    /** @type {Content|OptionList|Section[]} */
    const sections = [{
      header: 'Initialize configuration file for LINE API CLIs'.help,
      content: 'Initialize configuration file' + _os.EOL + _os.EOL + 'line init'.code + _os.EOL + _os.EOL + `This command should be run first time under project root folder. After run successfully, you will get ${this.configFileName} configuration file`
    }];
    return sections;
  }

  static async run() {
    const prompts = require('prompts');

    const exists = _fs.default.existsSync(`./${LINEInitOperation.configFileName}`);

    if (exists === true) {
      console.log(`${LINEInitOperation.configFileName} already exists`.warn);
      const {
        overwrite
      } = await prompts({
        type: 'toggle',
        name: 'overwrite',
        message: 'Do you want to overwrite?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
      });

      if (!overwrite) {
        return false;
      }
    }

    console.log('Setting up configuration file'.help);
    const {
      id
    } = await prompts({
      type: 'number',
      name: 'id',
      message: 'Channel ID?',
      hint: 'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
    }, this.cancelOption);
    const {
      secret
    } = await prompts({
      type: 'text',
      name: 'secret',
      message: 'Channel Secret?'
    }, this.cancelOption);
    const {
      hasLongLivedAccessToken
    } = await prompts({
      type: 'toggle',
      name: 'hasLongLivedAccessToken',
      message: 'Do you have long-lived access token?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    }, this.cancelOption);
    let accessToken = '';

    if (hasLongLivedAccessToken) {
      const rsToken = await prompts({
        type: 'text',
        name: 'accessToken',
        message: 'Long-lived access token?'
      }, this.cancelOption);
      accessToken = rsToken.accessToken;
    }

    const config = {
      channel: {
        id,
        secret,
        accessToken
      }
    };

    _fs.default.writeFileSync(`./${LINEInitOperation.configFileName}`, _jsYaml.default.safeDump(config));

    console.log(`Successfully written configuration file at ./${LINEInitOperation.configFileName}`.info);
    return true;
  }

}

exports.default = LINEInitOperation;
//# sourceMappingURL=line-init-operation.js.map