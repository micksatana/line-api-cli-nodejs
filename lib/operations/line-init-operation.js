import { Content, OptionList, Section } from 'command-line-usage';
import fs from 'fs';
import { EOL } from 'os';
import yaml from 'js-yaml';
import Operation from './operation';

export default class LINEInitOperation extends Operation {
  static get usage() {
    /** @type {Content|OptionList|Section[]} */
    const sections = [
      {
        header: 'Initialize configuration file for LINE API CLIs'.help,
        content:
          'Initialize configuration file' +
          EOL +
          EOL +
          'line init'.code +
          EOL +
          EOL +
          `This command should be run first time under project root folder. After run successfully, you will get ${this.configFileName} configuration file`
      }
    ];

    return sections;
  }

  static async run() {
    const prompts = require('prompts');
    const exists = fs.existsSync(`./${LINEInitOperation.configFileName}`);

    if (exists === true) {
      console.log(`${LINEInitOperation.configFileName} already exists`.warn);

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

    console.log('Setting up configuration file'.help);

    const { id } = await prompts(
      {
        type: 'number',
        name: 'id',
        message: 'Channel ID?',
        hint:
          'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
      },
      this.cancelOption
    );
    const { secret } = await prompts(
      {
        type: 'text',
        name: 'secret',
        message: 'Channel Secret?'
      },
      this.cancelOption
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
      this.cancelOption
    );

    let accessToken = '';

    if (hasLongLivedAccessToken) {
      const rsToken = await prompts(
        {
          type: 'text',
          name: 'accessToken',
          message: 'Long-lived access token?'
        },
        this.cancelOption
      );
      accessToken = rsToken.accessToken;
    }

    const config = {
      channel: { id, secret, accessToken }
    };

    fs.writeFileSync(
      `./${LINEInitOperation.configFileName}`,
      yaml.safeDump(config)
    );

    console.log(
      `Successfully written configuration file at ./${LINEInitOperation.configFileName}`
        .info
    );

    return true;
  }
}
