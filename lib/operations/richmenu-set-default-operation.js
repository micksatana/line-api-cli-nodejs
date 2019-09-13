import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import RichMenuListRequest from '../apis/rich-menu-list-request';
import RichMenuSetDefaultRequest from '../apis/rich-menu-set-default-request';

export default class RichmenuSetDefaultOperation extends Operation {
  static listRequest = new RichMenuListRequest({
    accessToken: this.config.channel.accessToken
  });
  static setDefaultRequest = new RichMenuSetDefaultRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Set a rich menu as default for all users'.help,
        content: `richmenu default`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    let richMenus = [];

    try {
      const response = await this.listRequest.send();

      richMenus = response.data.richmenus
        ? response.data.richmenus.map(menu => {
            return {
              title: `${menu.name} [${menu.richMenuId}]`,
              description: `${menu.chatBarText} has ${menu.areas.length} areas`,
              value: menu.richMenuId
            };
          })
        : [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!richMenus.length) {
      console.log('Rich menu not found'.info);
      return true;
    }

    const { richMenuId } = await prompts(
      {
        type: 'select',
        name: 'richMenuId',
        message: 'Select a rich menu as default for all users',
        choices: richMenus
      },
      this.cancelOption
    );

    try {
      await this.setDefaultRequest.send(richMenuId);
      console.log(`${richMenuId.code} set as default rich menu`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
