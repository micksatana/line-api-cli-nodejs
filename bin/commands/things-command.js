"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _colors = _interopRequireDefault(require("colors"));

var _command = _interopRequireDefault(require("./command"));

var _imageHelper = _interopRequireDefault(require("../image-helper"));

var _theme = _interopRequireDefault(require("../theme"));

var _thingsAddTrialOperation = _interopRequireDefault(require("../operations/things-add-trial-operation"));

var _thingsGetDeviceOperation = _interopRequireDefault(require("../operations/things-get-device-operation"));

var _thingsGetProductOperation = _interopRequireDefault(require("../operations/things-get-product-operation"));

var _thingsListTrialOperation = _interopRequireDefault(require("../operations/things-list-trial-operation"));

var _thingsRemoveTrialOperation = _interopRequireDefault(require("../operations/things-remove-trial-operation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsCommand extends _command.default {
  /**
   * @return {operation:string, options: ThingsCommandOptions, _unknown: Array<string>}
   */
  static getCommandLineArgs() {
    const commandLineArgs = require('command-line-args');

    const {
      operation,
      _unknown
    } = commandLineArgs([{
      name: 'operation',
      defaultOption: true
    }], {
      stopAtFirstUnknown: true
    });
    const argv = _unknown || [];
    const options = commandLineArgs([{
      name: 'help',
      alias: 'h',
      type: Boolean
    }, {
      name: 'version',
      alias: 'v',
      type: Boolean
    }], {
      argv
    });
    return {
      operation,
      options,
      _unknown
    };
  }

  static async cli() {
    try {
      _colors.default.setTheme(_theme.default);

      const {
        operation,
        options
      } = this.getCommandLineArgs();

      if (options.help) {
        const commandLineUsage = require('command-line-usage');

        await _imageHelper.default.draw('chick-helps');

        switch (operation) {
          case 'list:trial':
            console.log(commandLineUsage(_thingsListTrialOperation.default.usage));
            break;

          case 'add:trial':
            console.log(commandLineUsage(_thingsAddTrialOperation.default.usage));
            break;

          case 'remove:trial':
            console.log(commandLineUsage(_thingsRemoveTrialOperation.default.usage));
            break;

          case 'get:device':
            console.log(commandLineUsage(_thingsGetDeviceOperation.default.usage));
            break;

          case 'get:product':
            console.log(commandLineUsage(_thingsGetProductOperation.default.usage));
            break;

          default:
            console.log(commandLineUsage([..._thingsListTrialOperation.default.usage, ..._thingsAddTrialOperation.default.usage, ..._thingsRemoveTrialOperation.default.usage, ..._thingsGetDeviceOperation.default.usage, ..._thingsGetProductOperation.default.usage]));
        }

        process.exit(0);
        return;
      }

      if (options.version) {
        await _imageHelper.default.draw('chick-helps');
        console.log(this.versionText);
        process.exit(0);
        return;
      }

      if (operation === 'list:trial') {
        await _thingsListTrialOperation.default.run();
      } else if (operation === 'add:trial') {
        await _thingsAddTrialOperation.default.run();
      } else if (operation === 'remove:trial') {
        await _thingsRemoveTrialOperation.default.run();
      } else if (operation === 'get:device') {
        await _thingsGetDeviceOperation.default.run();
      } else if (operation === 'get:product') {
        await _thingsGetProductOperation.default.run();
      } else {
        await _imageHelper.default.draw('chick-helps');
        console.log(`Unknown operation: ${(operation || 'undefined').code}`.warn);
      }

      return;
    } catch (error) {
      await _imageHelper.default.draw('chick-helps');
      console.error(error);
      process.exit(1);
      return;
    }
  }

}

exports.default = ThingsCommand;
//# sourceMappingURL=things-command.js.map