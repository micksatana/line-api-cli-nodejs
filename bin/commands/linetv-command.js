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

var _linetvListModulesOperation = _interopRequireDefault(require("../operations/linetv-list-modules-operation"));

var _linetvGetSportlightOperation = _interopRequireDefault(require("../operations/linetv-get-sportlight-operation"));

var _linetvListCategoryOperation = _interopRequireDefault(require("../operations/linetv-list-category-operation"));

var _linetvGetCategoryOperation = _interopRequireDefault(require("../operations/linetv-get-category-operation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LINETvCommand extends _command.default {
  /**
   * @return {operation:string, options:LINETvCommandOptions, _unknown: Array<string>}
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
    }, {
      name: 'format',
      type: String
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
          case 'list:modules':
            console.log(commandLineUsage(_linetvListModulesOperation.default.usage));
            break;

          case 'get:spotlight':
            console.log(commandLineUsage(_linetvGetSportlightOperation.default.usage));
            break;

          case 'list:category':
            console.log(commandLineUsage(_linetvListCategoryOperation.default.usage));
            break;

          case 'get:category':
            console.log(commandLineUsage(_linetvGetCategoryOperation.default.usage));
            break;

          default:
            console.log(commandLineUsage([..._linetvListModulesOperation.default.usage, ..._linetvGetSportlightOperation.default.usage, ..._linetvListCategoryOperation.default.usage, ..._linetvGetCategoryOperation.default.usage]));
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

      if (operation === 'list:modules') {
        await _linetvListModulesOperation.default.run();
      } else if (operation === 'get:spotlight') {
        await _linetvGetSportlightOperation.default.run(options);
      } else if (operation === 'list:category') {
        await _linetvListCategoryOperation.default.run();
      } else if (operation === 'get:category') {
        await _linetvGetCategoryOperation.default.run();
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

exports.default = LINETvCommand;
//# sourceMappingURL=linetv-command.js.map