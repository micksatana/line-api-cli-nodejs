import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import { EOL } from 'os';
import Operation from './operation';
import LINETvListModulesRequest from '../apis/linetv-list-modules-request';

export default class LINETvListModulesOperation extends Operation {
  static request = new LINETvListModulesRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'List curation module types'.help,
        content:
          `To display culation moodule types in table` +
          EOL +
          EOL +
          `linetv list:modules`.code +
          EOL +
          EOL +
          `To get curation module types data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv list:modules --format json`.code
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
      /** @type {import('axios').AxiosResponse<LINETvListModulesResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data) {
        console.log('Curation module not found'.info);
        return true;
      }

      if (options.format === 'json') {
        console.log(JSON.stringify(response.data, null, 2));
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
