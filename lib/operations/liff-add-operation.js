import { Section } from 'command-line-usage';
import Operation from './operation';
import LIFFAddRequest from '../apis/liff-add-request';

export default class LIFFAddOperation extends Operation {
  static addRequest = new LIFFAddRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Add a LIFF view'.help,
        content: `liff add`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    return true;
  }
}
