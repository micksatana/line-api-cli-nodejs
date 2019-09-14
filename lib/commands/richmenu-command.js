import '../typedef';

import colors from 'colors';

import Command from './command';
import ImageHelper from '../image-helper';
import theme from '../theme';
import RichmenuAddOperation from '../operations/richmenu-add-operation';
import RichmenuLinkOperation from '../operations/richmenu-link-operation';
import RichmenuListOperation from '../operations/richmenu-list-operation';
import RichmenuRemoveOperation from '../operations/richmenu-remove-operation';
import RichmenuSetDefaultOperation from '../operations/richmenu-set-default-operation';
import RichmenuUnlinkOperation from '../operations/richmenu-unlink-operation';

export default class RichmenuCommand extends Command {
  /**
   * @return {operation:string, options:RichmenuCommandOptions, _unknown: Array<string>}
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
            console.log(commandLineUsage(RichmenuAddOperation.usage));
            break;
          case 'default':
            console.log(commandLineUsage(RichmenuSetDefaultOperation.usage));
            break;
          case 'link':
            console.log(commandLineUsage(RichmenuLinkOperation.usage));
            break;
          case 'list':
            console.log(commandLineUsage(RichmenuListOperation.usage));
            break;
          case 'remove':
            console.log(commandLineUsage(RichmenuRemoveOperation.usage));
            break;
          case 'unlink':
            console.log(commandLineUsage(RichmenuUnlinkOperation.usage));
            break;
          default:
            console.log(
              commandLineUsage([
                ...RichmenuAddOperation.usage,
                ...RichmenuListOperation.usage,
                ...RichmenuRemoveOperation.usage,
                ...RichmenuSetDefaultOperation.usage,
                ...RichmenuLinkOperation.usage,
                ...RichmenuUnlinkOperation.usage
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
        await RichmenuAddOperation.run();
      } else if (operation === 'default') {
        await RichmenuSetDefaultOperation.run();
      } else if (operation === 'link') {
        await RichmenuLinkOperation.run();
      } else if (operation === 'list') {
        await RichmenuListOperation.run();
      } else if (operation === 'remove') {
        await RichmenuRemoveOperation.run();
      } else if (operation === 'unlink') {
        await RichmenuUnlinkOperation.run();
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
