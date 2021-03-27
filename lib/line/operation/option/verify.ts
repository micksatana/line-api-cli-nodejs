import colors from 'colors/safe';
import prompts from 'prompts';
import { verifyAccessToken } from '../../../api/login/oauth2';

export const verify = async () => {
  const { accessToken } = await prompts({
    type: 'text',
    name: 'accessToken',
    message: 'Paste access token you want to verify here'
  });

  if (!accessToken) {
    return false;
  }

  try {
    const response = await verifyAccessToken({
      access_token: accessToken
    });

    if (response.status === 200) {
      console.log(colors.green('Verified'));
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
