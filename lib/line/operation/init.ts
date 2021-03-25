import { existsSync, writeFileSync } from 'fs';

import { CONFIG_FILE_NAME } from '../../config';
import { EOL } from 'os';
import colors from 'colors/safe';
import { dump } from 'js-yaml';

export const InitUsage = [
  {
    header: colors.green('Initialize configuration file for LINE API CLIs'),
    content:
      'Initialize configuration file' +
      EOL +
      EOL +
      colors.cyan('line init') +
      EOL +
      EOL +
      `This command should be run first time under project root folder. After run successfully, you will get ${CONFIG_FILE_NAME} configuration file`
  }
];

export const init = async (options) => {
  const prompts = require('prompts');
  const exists = existsSync(`./${CONFIG_FILE_NAME}`);

  if (exists === true) {
    console.log(colors.yellow(`${CONFIG_FILE_NAME} already exists`));

    const { overwrite } = await prompts({
      type: 'toggle',
      name: 'overwrite',
      message: 'Do you want to overwrite?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    });

    if (!overwrite) {
      return false;
    }
  }

  console.log(colors.green('Setting up configuration file'));

  const { id } = await prompts(
    {
      type: 'number',
      name: 'id',
      message: 'Channel ID?',
      hint:
        'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
    },
    {
      onCancel: () => process.exit(0)
    }
  );
  const { secret } = await prompts(
    {
      type: 'text',
      name: 'secret',
      message: 'Channel Secret?'
    },
    {
      onCancel: () => process.exit(0)
    }
  );

  const { hasLongLivedAccessToken } = await prompts(
    {
      type: 'toggle',
      name: 'hasLongLivedAccessToken',
      message: 'Do you have long-lived access token?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    },
    {
      onCancel: () => process.exit(0)
    }
  );

  let accessToken = '';

  if (hasLongLivedAccessToken) {
    const rsToken = await prompts(
      {
        type: 'text',
        name: 'accessToken',
        message: 'Long-lived access token?'
      },
      {
        onCancel: () => process.exit(0)
      }
    );
    accessToken = rsToken.accessToken;
  }

  const newConfig = {
    channel: { id, secret, accessToken }
  };

  writeFileSync(`./${CONFIG_FILE_NAME}`, dump(newConfig));

  console.log(
    colors.white(
      `Successfully written configuration file at ./${CONFIG_FILE_NAME}`
    )
  );

  return true;
};
