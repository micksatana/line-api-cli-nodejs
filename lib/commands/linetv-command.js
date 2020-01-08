import '../typedef';

import colors from 'colors';

import Command from './command';
import ImageHelper from '../image-helper';
import LINETvCurationListOperation from '../operations/linetv-curation-list-operation';
import theme from '../theme';

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
        { name: 'version', alias: 'v', type: Boolean }
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
          case 'curation:list':
            console.log(commandLineUsage(LINETvCurationListOperation.usage));
            break;

          default:
            console.log(
              commandLineUsage([
                ...LINETvCurationListOperation.usage,
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

      if (operation === 'curation:list') {
        await LINETvCurationListOperation.run();
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
