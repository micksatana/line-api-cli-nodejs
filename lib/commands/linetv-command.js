import '../typedef';

import colors from 'colors';

import Command from './command';
import ImageHelper from '../image-helper';
import theme from '../theme';
import LINETvListModulesOperation from '../operations/linetv-list-modules-operation';
import LINETvGetSportlightOperation from '../operations/linetv-get-sportlight-operation';
import LINETvListCategoryOperation from '../operations/linetv-list-category-operation';
import LINETvGetCategoryOperation from '../operations/linetv-get-category-operation';
import LINETvRankingOperation from '../operations/linetv-ranking-operation';

export default class LINETvCommand extends Command {
  /**
   * @return {operation:string, options:LINETvCommandOptions, _unknown: Array<string>}
   */
  static getCommandLineArgs() {
    const commandLineArgs = require('command-line-args');

    const { operation, _unknown } = commandLineArgs(
      [{ name: 'operation', defaultOption: true }],
      { stopAtFirstUnknown: true }
    );
    const argv = _unknown || [];
    const options = commandLineArgs(
      [
        { name: 'help', alias: 'h', type: Boolean },
        { name: 'version', alias: 'v', type: Boolean },
        { name: 'format', type: String }
      ],
      { argv }
    );

    return { operation, options, _unknown };
  }

  static async cli() {
    try {
      colors.setTheme(theme);

      const { operation, options } = this.getCommandLineArgs();

      if (options.help) {
        const commandLineUsage = require('command-line-usage');

        await ImageHelper.draw('chick-helps');

        switch (operation) {
          case 'list:modules':
            console.log(commandLineUsage(LINETvListModulesOperation.usage));
            break;
          case 'get:spotlight':
            console.log(commandLineUsage(LINETvGetSportlightOperation.usage));
            break;
          case 'list:category':
            console.log(commandLineUsage(LINETvListCategoryOperation.usage));
            break;
          case 'get:category':
            console.log(commandLineUsage(LINETvGetCategoryOperation.usage));
            break;
          case 'ranking':
            console.log(commandLineUsage(LINETvRankingOperation.usage));
            break;

          default:
            console.log(
              commandLineUsage([
                ...LINETvListModulesOperation.usage,
                ...LINETvGetSportlightOperation.usage,
                ...LINETvListCategoryOperation.usage,
                ...LINETvGetCategoryOperation.usage,
                ...LINETvRankingOperation.usage
              ])
            );
        }
        process.exit(0);
        return;
      }

      if (options.version) {
        await ImageHelper.draw('chick-helps');
        console.log(this.versionText);
        process.exit(0);
        return;
      }

      if (operation === 'list:modules') {
        await LINETvListModulesOperation.run();
      } else if (operation === 'get:spotlight') {
        await LINETvGetSportlightOperation.run(options);
      } else if (operation === 'list:category') {
        await LINETvListCategoryOperation.run();
      } else if (operation === 'get:category') {
        await LINETvGetCategoryOperation.run();
      } else if (operation === 'ranking') {
        await LINETvRankingOperation.run();
      } else {
        await ImageHelper.draw('chick-helps');
        console.log(
          `Unknown operation: ${(operation || 'undefined').code}`.warn
        );
      }
      return;
    } catch (error) {
      await ImageHelper.draw('chick-helps');
      console.error(error);
      process.exit(1);
      return;
    }
  }
}
