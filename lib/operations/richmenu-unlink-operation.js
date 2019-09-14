import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import RichMenuUnlinkUserRequest from '../apis/rich-menu-unlink-user-request';

export default class RichmenuUnlinkOperation extends Operation {
  static unlinkUserRequest = new RichMenuUnlinkUserRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Unlink user-specific rich menu'.help,
        content: `richmenu unlink`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const { userId } = await prompts(
      {
        type: 'text',
        name: 'userId',
        message: `Unlink menu from which user ID`
      },
      this.cancelOption
    );

    if (!userId) {
      return false;
    }

    try {
      await this.unlinkUserRequest.send(userId);
      console.log(
        `Unlinked menu from user ID ${userId.code}`
          .success
      );
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
