import { Section } from 'command-line-usage';
import Operation from './operation';
import RichMenuAddRequest from '../apis/rich-menu-add-request';

export default class RichmenuAddOperation extends Operation {
  static addRequest = new RichMenuAddRequest({
    accessToken: this.config.channel.accessToken
  });
  static uploadRequest;

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Add a rich menu'.help,
        content: `richmenu add`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    // TODO: prompts for data file
    // TODO: prompts for image file
    // TODO: send addRequest
    // TODO: send uploadRequest

    return true;
  }
}
