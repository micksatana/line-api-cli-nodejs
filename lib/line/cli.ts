import { InitUsage, init } from './operation/init';
import { TokenUsage, token } from './operation/token';

import colors from 'colors/safe';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { drawHelp } from '../draw';
import { version } from '../version';

export const cli = async () => {
  try {
    const { operation, _unknown } = commandLineArgs(
      [{ name: 'operation', defaultOption: true }],
      { stopAtFirstUnknown: true }
    );
    const argv = _unknown || [];
    const options = commandLineArgs(
      [
        { name: 'help', alias: 'h', type: Boolean },
        { name: 'version', alias: 'v', type: Boolean },
        { name: 'issue', type: Boolean },
        { name: 'revoke', type: Boolean },
        { name: 'verify', type: Boolean }
      ],
      { argv }
    );

    if (options.help) {
      switch (operation) {
        case 'init':
          console.log(commandLineUsage(InitUsage));
          break;
        case 'token':
          console.log(commandLineUsage(TokenUsage));
          break;
        default:
          console.log(commandLineUsage([...InitUsage, ...TokenUsage]));
      }
      process.exit(0);
    }

    if (options.version) {
      console.log(version());
      process.exit(0);
    }

    if (operation === 'init') {
      await init(options);
    } else if (operation === 'token') {
      await token(options);
    } else {
      await drawHelp();
      console.log(
        colors.yellow(
          `Unknown operation: ${colors.cyan(operation || 'undefined')}`
        )
      );
    }
    return;
  } catch (error) {
    await drawHelp();
    console.error(error);
    process.exit(1);
  }
};
