import { CONFIG_FILE_NAME, loadConfig } from '../../../config';
import colors, { green, white } from 'colors/safe';

import { dump } from 'js-yaml';
import { issueAccessToken } from '../../../api/login/oauth2';
import prompts from 'prompts';
import { writeFileSync } from 'fs';

export const issue = async () => {
  const config = loadConfig();
  let accessToken;
  let expiryDate = new Date();

  try {
    const response = await issueAccessToken({
      grant_type: 'client_credentials',
      client_id: `${config.channel.id}`,
      client_secret: config.channel.secret
    });

    accessToken = response.data.access_token;
    expiryDate.setSeconds(response.data.expires_in);

    console.log(green(`Access token: ${white(accessToken)}`));
    console.log(green(`Expiry date: ${white(expiryDate.toISOString())}`));
  } catch (error) {
    console.error(error);
    return false;
  }

  const { save } = await prompts({
    type: 'toggle',
    name: 'save',
    message: 'Overwrite short-lived access token to configuration file?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  });

  if (save) {
    const newConfig = {
      ...config
    };

    newConfig.channel.accessToken = accessToken;
    writeFileSync(`./${CONFIG_FILE_NAME}`, dump(newConfig));
  }

  return true;
};
