"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _fs = _interopRequireDefault(require("fs"));

var _jsYaml = _interopRequireDefault(require("js-yaml"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Operation {
  static get configFileName() {
    return '.line-api-cli.yml';
  }
  /** @type {Config} */


  static get config() {
    if (!this._config) {
      let configFile;

      try {
        configFile = _fs.default.readFileSync(`./${this.configFileName}`);
      } catch (_) {
        console.log(`Run command ${`line init`.code} to initialize project configuration file`.help);
        process.exit(0);
      }

      try {
        this._config = _jsYaml.default.safeLoad(configFile);
      } catch (error) {
        console.log('Unable to safe load configuration file', error);
        process.exit(1);
      }
    }

    return this._config;
  }

  static validateConfig() {
    if (!this.config.channel.id || !this.config.channel.secret) {
      console.log(`Run command ${`line init`.code} to initialize project configuration file`.help);
      return false;
    }

    if (!this.config.channel.accessToken) {
      console.log(`Run command ${`line token --issue`.code} and save access token project configuration file`.help);
      return false;
    }

    return true;
  }

  static validateFileExists(value) {
    if (value) {
      return _fs.default.existsSync(value) === true ? true : 'File not exists';
    } else {
      return 'Please input data file location to proceed.';
    }
  }

}

exports.default = Operation;

_defineProperty(Operation, "cancelOption", {
  onCancel: () => process.exit(0)
});

_defineProperty(Operation, "_config", void 0);
//# sourceMappingURL=operation.js.map