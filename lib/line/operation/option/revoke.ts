import colors from 'colors/safe';
import { config } from '../../../config';
import prompts from 'prompts';
import { revokeAccessToken } from '../../../api/login/oauth2';

export const revoke = async () => {
  const { accessToken } = await prompts({
    type: 'text',
    name: 'accessToken',
    message: 'Paste access token you want to revoke here'
  });

  if (!accessToken) {
    return false;
  }

  try {
    const response = await revokeAccessToken({
      access_token: accessToken,
      client_id: `${config().channel.id}`,
      client_secret: config().channel.secret
    });

    if (response.status === 200) {
      console.log(colors.green('Revoked'));
      return true;
    } else {
      console.log(colors.yellow(`Response with status ${response.status}`));
      return false;
    }
  } catch (error) {
    console.error(colors.red(`${error.response.statusText} or invalid token`));
    return false;
  }
};
