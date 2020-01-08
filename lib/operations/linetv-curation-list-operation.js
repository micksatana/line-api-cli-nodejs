import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LINETvCurationListRequest from '../apis/linetv-curation-list-request';

export default class LINETvCurationListOperation extends Operation {
  static curationListRequest = new LINETvCurationListRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Sportlight Curation Moudule Type'.help,
        content: `sportlight curation module list`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    // TODO: get channelId from .yml
    const channelId = '';

    const { countryCode } =
      (await prompts(
        {
          type: 'text',
          name: 'countryCode',
          message: 'Country Code?'
        },
        this.cancelOption
      )) || {};

    try {
      const response = await this.curationModuleType.send(
        channelId,
        countryCode
      );

      console.log(response.data.items);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }
}
