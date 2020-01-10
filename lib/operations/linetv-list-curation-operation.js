import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LINETvListCurationRequest from '../apis/linetv-list-curation-request';

export default class LINETvListCurationOperation extends Operation {
  static request = new LINETvListCurationRequest({
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

    try {
      /** @type {import('axios').AxiosResponse<LINETvCurationListResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data) {
        console.log('Curation module not found'.info);
        return true;
      }
      const curationModules = response.data.body.supportModule.map(item => {
        const columnHeader = {};
        columnHeader['Name'.success] = item.name;
        columnHeader['Data Model'.success] = item.dataModel;
        return columnHeader;
      });
      console.table(curationModules);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }
    return true;
  }
}
