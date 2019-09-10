import colors from 'colors';

import theme from './theme';
import LINEInitOperation from './line-init-operation';
import { version } from '../package.json';

/**
 * @typedef LINECommandArgs
 * @property {string} operation
 * @property {object} options
 * @property {Boolean} options.help
 * @property {Boolean} options.version
 * @property {string[]} _unknown
 */

export default class LINECommand {
  static get versionText() {
    return `LINE CLIs v${version}`;
  }

  /**
   * @return {LINECommandArgs}
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

        switch (operation) {
          case 'init':
            console.log(commandLineUsage(LINEInitOperation.usage));
            break;
          default:
            console.log(commandLineUsage([LINEInitOperation.usage]));
        }
        process.exit(0);
      }

      if (options.version) {
        console.log(this.versionText);
        process.exit(0);
      }

      if (operation === 'init') {
        await LINEInitOperation.run();
      } else {
        console.log(`Unknown operation: ${operation}`);
      }
      return;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
