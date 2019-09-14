import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import RichMenuListRequest from '../apis/rich-menu-list-request';
import RichMenuLinkUserRequest from '../apis/rich-menu-link-user-request';

export default class RichmenuLinkOperation extends Operation {
  static listRequest = new RichMenuListRequest({
    accessToken: this.config.channel.accessToken
  });
  static linkUserRequest = new RichMenuLinkUserRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Link a rich menu to a user'.help,
        content: `richmenu link`.code
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
              value: menu
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

    /** @type {{richMenu:RichMenuData}} */
    const { richMenu } = await prompts(
      {
        type: 'select',
        name: 'richMenu',
        message: 'Select a rich menu for a user',
        choices: richMenus
      },
      this.cancelOption
    );

    if (!richMenu) {
      return false;
    }

    const { userId } = await prompts(
      {
        type: 'text',
        name: 'userId',
        message: `Link ${richMenu.name} to which user ID`
      },
      this.cancelOption
    );

    if (!userId) {
      return false;
    }

    try {
      await this.linkUserRequest.send(richMenu.richMenuId, userId);
      console.log(
        `${richMenu.name.code} [${richMenu.richMenuId}] is now visible to user ID ${userId.code}`
          .success
      );
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
