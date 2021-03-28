import { CONFIG_FILE_NAME, loadConfig } from '../../config';
import { green, red, white, yellow } from 'colors/safe';
import { issue, revoke, verify } from './options';

import { CommandLineOptions } from 'command-line-args';
import { print } from './usage';

export interface TokenCommandLineOptions extends CommandLineOptions {
  issue: boolean;
  revoke: boolean;
  verify: boolean;
}

export const command = async (options: TokenCommandLineOptions) => {
  if (
    !options ||
    (options.issue !== true &&
      options.revoke !== true &&
      options.verify !== true)
  ) {
    print();
    console.log(red('Required --issue, --revoke or --verify'));
    process.exit(0);
  }

  const config = loadConfig();

  if (!config.channel.id) {
    console.log(yellow('Channel ID not found'));
    console.log(
      green(`Setup channel ID at ${white(CONFIG_FILE_NAME)} and re-run again`)
    );

    process.exit(0);
  }

  if (!config.channel.secret) {
    console.log(yellow('Channel secret not found'));
    console.log(
      green(
        `Setup channel secret at ${white(CONFIG_FILE_NAME)} and re-run again`
      )
    );

    process.exit(0);
  }

  if (options.issue === true) {
    return issue();
  } else if (options.revoke === true) {
    return revoke();
  } else {
    return verify();
  }
};
