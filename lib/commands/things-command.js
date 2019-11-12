import '../typedef';

import colors from 'colors';

import Command from './command';
import ImageHelper from '../image-helper';
import theme from '../theme';

import ThingsAddTrialOperation from '../operations/things-add-trial-operation';
import ThingsGetDeviceOperation from '../operations/things-get-device-operation';
import ThingsGetProductOperation from '../operations/things-get-product-operation';
import ThingsListTrialOperation from '../operations/things-list-trial-operation';
import ThingsRemoveTrialOperation from '../operations/things-remove-trial-operation';

export default class ThingsCommand extends Command {
  /**
   * @return {operation:string, options: ThingsCommandOptions, _unknown: Array<string>}
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
          case 'list:trial':
            console.log(commandLineUsage(ThingsListTrialOperation.usage));
            break;
          case 'add:trial':
            console.log(commandLineUsage(ThingsAddTrialOperation.usage));
            break;
          case 'remove:trial':
            console.log(commandLineUsage(ThingsRemoveTrialOperation.usage));
            break;
          case 'get:device':
            console.log(commandLineUsage(ThingsGetDeviceOperation.usage));
            break;
          case 'get:product':
            console.log(commandLineUsage(ThingsGetProductOperation.usage));
            break;
          default:
            console.log(
              commandLineUsage([
                ...ThingsListTrialOperation.usage,
                ...ThingsAddTrialOperation.usage,
                ...ThingsRemoveTrialOperation.usage,
                ...ThingsGetDeviceOperation.usage,
                ...ThingsGetProductOperation.usage
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

      if (operation === 'list:trial') {
        await ThingsListTrialOperation.run();
      } else if (operation === 'add:trial') {
        await ThingsAddTrialOperation.run();
      } else if (operation === 'remove:trial') {
        await ThingsRemoveTrialOperation.run();
      } else if (operation === 'get:device') {
        await ThingsGetDeviceOperation.run();
      } else if (operation === 'get:product') {
        await ThingsGetProductOperation.run();
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
