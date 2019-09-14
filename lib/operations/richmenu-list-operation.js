import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import RichMenuListRequest from '../apis/rich-menu-list-request';

export default class RichmenuListOperation extends Operation {
  static listRequest = new RichMenuListRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'List rich menus'.help,
        content: `richmenu list`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let richMenus;

    try {
      const response = await this.listRequest.send();

      richMenus = response.data.richmenus;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!richMenus || richMenus.length === 0) {
      console.log('Rich menu not found'.info);
      return true;
    }

    console.table(
      richMenus.map(menu => {
        const row = {};

        row['Rich menu ID'.success] = menu.richMenuId;
        row['Name'.success] = menu.name;
        row['Bar text'.success] = menu.chatBarText;
        row['Size'.success] = `${menu.size.width}x${menu.size.height}`;
        row['No. of Areas'.success] = menu.areas.length;
        row['Selected'.success] = menu.selected;
        
        return row;
      })
    );

    return true;
  }
}
