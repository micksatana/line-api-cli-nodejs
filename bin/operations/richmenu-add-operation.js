"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commandLineUsage = require("command-line-usage");

var _path = _interopRequireDefault(require("path"));

var _operation = _interopRequireDefault(require("./operation"));

var _richMenuAddRequest = _interopRequireDefault(require("../apis/rich-menu-add-request"));

var _richMenuUploadRequest = _interopRequireDefault(require("../apis/rich-menu-upload-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichmenuAddOperation extends _operation.default {
  static get usage() {
    /** @type {Section[]} */
    const sections = [{
      header: 'Add a rich menu'.help,
      content: `richmenu add`.code
    }];
    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');
    /** @type {{ dataFilePath:string }} */


    let {
      dataFilePath
    } = await prompts({
      type: 'text',
      name: 'dataFilePath',
      message: 'Input data file path',
      validate: this.validateFileExists
    }, this.cancelOption);

    if (!dataFilePath) {
      return false;
    }

    if (!_path.default.isAbsolute(dataFilePath)) {
      dataFilePath = _path.default.resolve('./', dataFilePath);
    }
    /** @type {{ imageFilePath:string }} */


    let {
      imageFilePath
    } = await prompts({
      type: 'text',
      name: 'imageFilePath',
      message: 'Input image file path',
      validate: this.validateFileExists
    }, this.cancelOption);

    if (!imageFilePath) {
      return false;
    }

    let richMenuId = '';

    try {
      const response = await this.addRequest.send(require(dataFilePath));
      richMenuId = response.data.richMenuId;
      console.log(`Rich menu ID: ${richMenuId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    try {
      await this.uploadRequest.send(richMenuId, imageFilePath);
      console.log(`Rich menu image uploaded`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

}

exports.default = RichmenuAddOperation;

_defineProperty(RichmenuAddOperation, "addRequest", new _richMenuAddRequest.default({
  accessToken: RichmenuAddOperation.config.channel.accessToken
}));

_defineProperty(RichmenuAddOperation, "uploadRequest", new _richMenuUploadRequest.default({
  accessToken: RichmenuAddOperation.config.channel.accessToken
}));
//# sourceMappingURL=richmenu-add-operation.js.map