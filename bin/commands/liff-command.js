"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _colors = _interopRequireDefault(require("colors"));

var _command = _interopRequireDefault(require("./command"));

var _imageHelper = _interopRequireDefault(require("../image-helper"));

var _liffAddOperation = _interopRequireDefault(require("../operations/liff-add-operation"));

var _liffListOperation = _interopRequireDefault(require("../operations/liff-list-operation"));

var _liffRemoveOperation = _interopRequireDefault(require("../operations/liff-remove-operation"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LIFFCommand extends _command.default {
  /**
   * @return {operation:string, options:LIFFCommandOptions, _unknown: Array<string>}
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
            console.log(commandLineUsage(_liffAddOperation.default.usage));
            break;

          case 'list':
            console.log(commandLineUsage(_liffListOperation.default.usage));
            break;

          case 'remove':
            console.log(commandLineUsage(_liffRemoveOperation.default.usage));
            break;

          default:
            console.log(commandLineUsage([..._liffAddOperation.default.usage]));
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
        await _liffAddOperation.default.run(options);
      } else if (operation === 'list') {
        await _liffListOperation.default.run(options);
      } else if (operation === 'remove') {
        await _liffRemoveOperation.default.run(options);
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

exports.default = LIFFCommand;
//# sourceMappingURL=liff-command.js.map