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

var _richmenuAddOperation = _interopRequireDefault(require("../operations/richmenu-add-operation"));

var _richmenuSetDefaultOperation = _interopRequireDefault(require("../operations/richmenu-set-default-operation"));

var _richmenuListOperation = _interopRequireDefault(require("../operations/richmenu-list-operation"));

var _richmenuRemoveOperation = _interopRequireDefault(require("../operations/richmenu-remove-operation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichmenuCommand extends _command.default {
  /**
   * @return {operation:string, options:RichmenuCommandOptions, _unknown: Array<string>}
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
          case 'add':
            console.log(commandLineUsage(_richmenuAddOperation.default.usage));
            break;

          case 'default':
            console.log(commandLineUsage(_richmenuSetDefaultOperation.default.usage));
            break;

          case 'list':
            console.log(commandLineUsage(_richmenuListOperation.default.usage));
            break;

          case 'remove':
            console.log(commandLineUsage(_richmenuRemoveOperation.default.usage));
            break;

          default:
            console.log(commandLineUsage([..._richmenuAddOperation.default.usage, ..._richmenuListOperation.default.usage, ..._richmenuRemoveOperation.default.usage, ..._richmenuSetDefaultOperation.default.usage]));
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

      if (operation === 'add') {
        await _richmenuAddOperation.default.run();
      } else if (operation === 'default') {
        await _richmenuSetDefaultOperation.default.run();
      } else if (operation === 'list') {
        await _richmenuListOperation.default.run();
      } else if (operation === 'remove') {
        await _richmenuRemoveOperation.default.run();
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

exports.default = RichmenuCommand;
//# sourceMappingURL=richmenu-command.js.map