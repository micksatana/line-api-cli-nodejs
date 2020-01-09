import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LINETvCurationListRequest from '../apis/linetv-curation-list-request';

export default class LINETvCurationListOperation extends Operation {
  static request = new LINETvCurationListRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'List curation module types'.help,
        content: `linetv list:curation`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');
    const channelId = this.config.channel.id;

    const { countryCode } =
      (await prompts(
        {
          type: 'text',
          name: 'countryCode',
          message: 'Country Code?'
        },
        this.cancelOption
      )) || {};

    let curationList;

    try {
      /** @type {import('axios').AxiosResponse<LINETvCurationListResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      curationList = response.data.body.supportModule;
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    if (curationList) {
      console.log(curationList);
    } else {
      console.log('Curation list not found'.info);
      return true;
    }

    return true;
  }
}
