import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import RichMenuListRequest from '../apis/rich-menu-list-request';
import RichMenuRemoveRequest from '../apis/rich-menu-remove-request';

export default class RichmenuRemoveOperation extends Operation {
  static listRequest = new RichMenuListRequest({
    accessToken: this.config.channel.accessToken
  });
  static removeRequest = new RichMenuRemoveRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Remove a rich menu'.help,
        content: `richmenu remove`.code
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
        message: 'Select a rich menu to be removed',
        choices: richMenus
      },
      this.cancelOption
    );

    try {
      await this.removeRequest.send(richMenuId);
      console.log(`Removed rich menu ID: ${richMenuId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
