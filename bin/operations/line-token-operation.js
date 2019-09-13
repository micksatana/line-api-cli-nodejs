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

var _oauthIssueTokenRequest = _interopRequireDefault(require("../apis/oauth-issue-token-request"));

var _oauthRevokeTokenRequest = _interopRequireDefault(require("../apis/oauth-revoke-token-request"));

var _imageHelper = _interopRequireDefault(require("../image-helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LINETokenOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Issue/Revoke access token '.help,
      content: `After channel ID and secret are configured. Issue a channel access token and save it.` + _os.EOL + _os.EOL + `line token --issue`.code + _os.EOL + _os.EOL + `In case you want to revoke an access token, you can run with --revoke option.` + _os.EOL + _os.EOL + `line token --revoke`.code
    }, {
      header: 'Options',
      optionList: [{
        name: 'issue'.code,
        description: 'Issue a channel access token from pre-configured channel ID and secret'
      }, {
        name: 'revoke'.code,
        typeLabel: '{underline accessToken}'.input,
        description: 'Revoke a channel access token.'
      }]
    }];
    return sections;
  }

  static async run(options) {
    if (!options || options.issue !== true && options.revoke !== true) {
      await _imageHelper.default.draw('chick-helps');
      console.log(require('command-line-usage')(this.usage));
      return false;
    }

    if (!this.config.channel.id) {
      console.log(`Channel ID not found`.warn);
      console.log(`Setup channel ID at ${this.configFileName.info} and re-run again`.help);
      return false;
    }

    if (!this.config.channel.secret) {
      console.log(`Channel secret not found`.warn);
      console.log(`Setup channel secret at ${this.configFileName.info} and re-run again`.help);
      return false;
    }

    if (options.issue === true) {
      return this.issue();
    } else {
      // `options.revoke` will be true due to the first if-condition in this `run` method
      return this.revoke();
    }
  }

  static async issue() {
    let accessToken;
    let expiryDate = new Date();

    try {
      const response = await this.issueRequest.send(this.config.channel.id, this.config.channel.secret);
      accessToken = response.data.access_token;
      expiryDate.setSeconds(response.data.expires_in);
      console.log(`Access token: ${accessToken.info}`.help);
      console.log(`Expiry date: ${expiryDate.toLocaleString().info}`.help);
    } catch (error) {
      console.error(error);
      return false;
    }

    const prompts = require('prompts');

    const {
      save
    } = await prompts({
      type: 'toggle',
      name: 'save',
      message: 'Overwrite short-lived access token to configuration file?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    });

    if (save) {
      const config = _objectSpread({}, this.config);

      config.channel.accessToken = accessToken;

      _fs.default.writeFileSync(`./${this.configFileName}`, _jsYaml.default.safeDump(config));
    }

    return true;
  }

  static async revoke() {
    const prompts = require('prompts');

    const {
      accessToken
    } = await prompts({
      type: 'text',
      name: 'accessToken',
      message: 'Paste access token you want to revoke here'
    });

    if (!accessToken) {
      return false;
    }

    try {
      const response = await this.revokeRequest.send(accessToken);

      if (response.status === 200) {
        console.log('Revoked'.success);
        return true;
      } else {
        console.log(`Response with status ${response.status}`.warn);
        return false;
      }
    } catch (error) {
      console.error(`${error.response.statusText} or invalid token`.error);
      return false;
    }
  }

}

exports.default = LINETokenOperation;

_defineProperty(LINETokenOperation, "issueRequest", new _oauthIssueTokenRequest.default());

_defineProperty(LINETokenOperation, "revokeRequest", new _oauthRevokeTokenRequest.default());
//# sourceMappingURL=line-token-operation.js.map