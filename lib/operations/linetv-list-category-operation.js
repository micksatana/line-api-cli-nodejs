import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LINETvListCategoryRequest from '../apis/linetv-list-catagory-request';

export default class LINETvListCategoryOperation extends Operation {
  static request = new LINETvListCategoryRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Gets a category list such as drama, music, etc.'.help,
        content: `linetv list:category`.code
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
      /** @type {import('axios').AxiosResponse<LINETvListCategoryResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data || response.data.body === null) {
        console.log('Category list not found'.info);
        return true;
      }
      const CategoryList = response.data.body.tabs.map(item => {
        const columnHeader = {};
        columnHeader['Category'.success] = item.categoryName;
        columnHeader['Category Code'.success] = item.categoryCode;
        columnHeader['URL'.success] = item.serviceUrl;
        return columnHeader;
      });
      console.table(CategoryList);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }
    return true;
  }
}
