import { CONFIG_FILE_NAME, config } from '../../config';

import { EOL } from 'os';
import colors from 'colors/safe';
import commandLineUsage from 'command-line-usage';
import { drawHelp } from '../../draw';
import { issue } from './option/issue';
import { revoke } from './option/revoke';

export const TokenUsage = [
  {
    header: colors.green('Issue/Revoke access token '),
    content:
      `After channel ID and secret are configured. Issue a channel access token and save it.` +
      EOL +
      EOL +
      colors.cyan(`line token --issue`) +
      EOL +
      EOL +
      `In case you want to revoke an access token, you can run with --revoke option.` +
      EOL +
      EOL +
      colors.cyan(`line token --revoke`)
  },
  {
    header: 'Options',
    optionList: [
      {
        name: colors.cyan('issue'),
        description:
          'Issue a channel access token from pre-configured channel ID and secret'
      },
      {
        name: colors.cyan('revoke'),
        typeLabel: colors.grey('{underline accessToken}'),
        description: 'Revoke a channel access token.'
      }
    ]
  }
];

export const token = async (options) => {
  if (!options || (options.issue !== true && options.revoke !== true)) {
    await drawHelp();
    console.log(commandLineUsage(TokenUsage));

    return false;
  }

  const configFileNameText = colors.white(CONFIG_FILE_NAME);

  if (!config().channel.id) {
    console.log(colors.yellow('Channel ID not found'));
    console.log(
      colors.green(`Setup channel ID at ${configFileNameText} and re-run again`)
    );

    return false;
  }

  if (!config().channel.secret) {
    console.log(colors.yellow('Channel secret not found'));
    console.log(
      colors.green(
        `Setup channel secret at ${configFileNameText} and re-run again`
      )
    );

    return false;
  }

  if (options.issue === true) {
    return issue();
  } else {
    // `options.revoke` will be true due to the first if-condition in this `run` method
    return revoke();
  }
};
