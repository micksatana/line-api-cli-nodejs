import '../typedef';

import colors from 'colors';

import Command from './command';
import ImageHelper from '../image-helper';
import LIFFAddOperation from '../operations/liff-add-operation';
import LIFFListOperation from '../operations/liff-list-operation';
import LIFFRemoveOperation from '../operations/liff-remove-operation';
import LIFFUpdateOperation from '../operations/liff-update-operation';
import theme from '../theme';

export default class LIFFCommand extends Command {
  /**
   * @return {operation:string, options:LIFFCommandOptions, _unknown: Array<string>}
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
          case 'add':
            console.log(commandLineUsage(LIFFAddOperation.usage));
            break;
          case 'list':
            console.log(commandLineUsage(LIFFListOperation.usage));
            break;
          case 'remove':
            console.log(commandLineUsage(LIFFRemoveOperation.usage));
            break;
          case 'update':
            console.log(commandLineUsage(LIFFUpdateOperation.usage));
            break;
          default:
            console.log(
              commandLineUsage([
                ...LIFFAddOperation.usage,
                ...LIFFListOperation.usage,
                ...LIFFRemoveOperation.usage,
                ...LIFFUpdateOperation.usage
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

      if (operation === 'add') {
        await LIFFAddOperation.run(options);
      } else if (operation === 'list') {
        await LIFFListOperation.run(options);
      } else if (operation === 'remove') {
        await LIFFRemoveOperation.run(options);
      } else if (operation === 'update') {
        await LIFFUpdateOperation.run(options);
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
