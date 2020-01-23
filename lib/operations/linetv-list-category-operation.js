import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import { EOL } from 'os';
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
      content:
        `To display category list in table` +
        EOL +
        EOL +
        `linetv list:category`.code +
        EOL +
        EOL +
        `To get category list data in JSON format, you can run with --format option.` +
        EOL +
        EOL +
        `linetv list:category --format json`.code
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'format'.code,
          description: 'To get data in JSON format'
        }
      ]
    }
  ];

    return sections;
  }

  static validateCountryCode(countryCode) {
    return countryCode.length !== 2
      ? 'Please input ISO 3166-2 (2 characters)'
      : true;
  }

  static async run(options) {
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
          message: `Country Code ${'ISO 3166-2'.prompt}`,
          validate: this.validateCountryCode
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

      if (options.format === 'json') {
        console.log(JSON.stringify(response.data, null, 2));
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
