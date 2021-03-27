import { CONFIG_FILE_NAME, config } from '../../config';

import { EOL } from 'os';
import colors from 'colors/safe';
import commandLineUsage from 'command-line-usage';
import { drawHelp } from '../../draw';
import { issue } from './option/issue';
import { revoke } from './option/revoke';
import { verify } from './option/verify';

export const TokenUsage = [
  {
    header: colors.green('Issue/Revoke/Verify access token '),
    content:
      `After channel ID and secret are configured. Issue a channel access token and save it in ${colors.grey(
        CONFIG_FILE_NAME
      )}` +
      EOL +
      EOL +
      colors.cyan(`line token --issue`) +
      EOL +
      EOL +
      `To revoke an access token,` +
      EOL +
      EOL +
      colors.cyan(`line token --revoke`) +
      EOL +
      EOL +
      `To verify an access token,` +
      EOL +
      EOL +
      colors.cyan(`line token --verify`)
  },
  {
    header: 'Options',
    optionList: [
      {
        name: colors.cyan('issue'),
        typeLabel: ' ',
        description:
          'Issue a channel access token from pre-configured channel ID and secret'
      },
      {
        name: colors.cyan('revoke'),
        typeLabel: ' ',
        description: 'Revoke a channel access token.'
      },
      {
        name: colors.cyan('verify'),
        typeLabel: ' ',
        description: 'Verify a channel access token.'
      }
    ]
  }
];

export const token = async (options) => {
  if (
    !options ||
    (options.issue !== true &&
      options.revoke !== true &&
      options.verify !== true)
  ) {
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
  } else if (options.revoke === true) {
    return revoke();
  } else {
    return verify();
  }
};
