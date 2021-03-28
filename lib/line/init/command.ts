import { existsSync, writeFileSync } from 'fs';
import { green, white, yellow } from 'colors/safe';

import { CONFIG_FILE_NAME } from '../../config';
import { CommandLineOptions } from 'command-line-args';
import { dump } from 'js-yaml';
import prompts from 'prompts';

export const command = async (options: CommandLineOptions) => {
  const exists = existsSync(`./${CONFIG_FILE_NAME}`);

  if (exists === true) {
    console.log(yellow(`${CONFIG_FILE_NAME} already exists`));

    const { overwrite } = await prompts({
      type: 'toggle',
      name: 'overwrite',
      message: 'Do you want to overwrite?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    });

    if (!overwrite) {
      process.exit(0);
    }
  }

  console.log(green('Setting up configuration file'));

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
    white(`Successfully written configuration file at ./${CONFIG_FILE_NAME}`)
  );

  process.exit(0);
};
