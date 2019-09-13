import { Section } from 'command-line-usage';
import fs from 'fs';
import { EOL } from 'os';
import yaml from 'js-yaml';

import Operation from './operation';
import OAuthIssueTokenRequest from '../apis/oauth-issue-token-request';
import OAuthRevokeTokenRequest from '../apis/oauth-revoke-token-request';
import ImageHelper from '../image-helper';

export default class LINETokenOperation extends Operation {
  static issueRequest = new OAuthIssueTokenRequest();
  static revokeRequest = new OAuthRevokeTokenRequest();

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Issue/Revoke access token '.help,
        content:
          `After channel ID and secret are configured. Issue a channel access token and save it.` +
          EOL +
          EOL +
          `line token --issue`.code +
          EOL +
          EOL +
          `In case you want to revoke an access token, you can run with --revoke option.` +
          EOL +
          EOL +
          `line token --revoke`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'issue'.code,
            description:
              'Issue a channel access token from pre-configured channel ID and secret'
          },
          {
            name: 'revoke'.code,
            typeLabel: '{underline accessToken}'.input,
            description: 'Revoke a channel access token.'
          }
        ]
      }
    ];

    return sections;
  }

  static async run(options) {
    if (!options || (options.issue !== true && options.revoke !== true)) {
      await ImageHelper.draw('chick-helps');
      console.log(require('command-line-usage')(this.usage));

      return false;
    }

    if (!this.config.channel.id) {
      console.log(`Channel ID not found`.warn);
      console.log(
        `Setup channel ID at ${this.configFileName.info} and re-run again`.help
      );

      return false;
    }

    if (!this.config.channel.secret) {
      console.log(`Channel secret not found`.warn);
      console.log(
        `Setup channel secret at ${this.configFileName.info} and re-run again`
          .help
      );

      return false;
    }

    if (options.issue === true) {
      return this.issue();
    } else { // `options.revoke` will be true due to the first if-condition in this `run` method
      return this.revoke();
    }
  }

  static async issue() {
    let accessToken;
    let expiryDate = new Date();

    try {
      const response = await this.issueRequest.send(
        this.config.channel.id,
        this.config.channel.secret
      );

      accessToken = response.data.access_token;
      expiryDate.setSeconds(response.data.expires_in);

      console.log(`Access token: ${accessToken.info}`.help);
      console.log(`Expiry date: ${expiryDate.toLocaleString().info}`.help);
    } catch (error) {
      console.error(error);
      return false;
    }

    const prompts = require('prompts');
    const { save } = await prompts({
      type: 'toggle',
      name: 'save',
      message: 'Overwrite short-lived access token to configuration file?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    });

    if (save) {
      const config = {
        ...this.config
      };

      config.channel.accessToken = accessToken;
      fs.writeFileSync(`./${this.configFileName}`, yaml.safeDump(config));
    }

    return true;
  }

  static async revoke() {
    const prompts = require('prompts');
    const { accessToken } = await prompts({
      type: 'text',
      name: 'accessToken',
      message: 'Paste access token you want to revoke here'
    });

    if (!accessToken) {
      return false;
    }

    try {
      const response = await this.revokeRequest.send(accessToken);

      if (response.status === 200) {
        console.log('Revoked'.success);
        return true;
      } else {
        console.log(`Response with status ${response.status}`.warn);
        return false;
      }
    } catch (error) {
      console.error(`${error.response.statusText} or invalid token`.error);
      return false;
    }
  }
}
