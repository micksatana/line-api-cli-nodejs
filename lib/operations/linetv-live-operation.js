import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import { EOL } from 'os';
import Operation from './operation';
import LINETvLiveRequest from '../apis/linetv-live-request';

export default class LINETvLiveOperation extends Operation {
  static request = new LINETvLiveRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Gets live schedule information'.help,
        content:
          `To display live schedule in table` +
          EOL +
          EOL +
          `linetv live`.code +
          EOL +
          EOL +
          `To get live schedule data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv live --format json`.code
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
      ));

    try {
      /** @type {import('axios').AxiosResponse<LINETvLiveResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data || response.data.body === null) {
        console.log('Cannot find live schdule'.warn);
        return true;
      }

      if (options.format === 'json') {
        console.log(JSON.stringify(response.data, null, 2));
        return true;
      }

      const liveSchdule = response.data.body.lives.map(item => {
        const columnHeader = {};
        columnHeader['Live No'.success] = item.liveNo;
        columnHeader['Channel Name'.success] = item.channelName;
        columnHeader['Title'.success] = item.liveTitle;
        columnHeader['Status'.success] = item.liveStatus;
        columnHeader['Start'.success] = item.liveStartDate;
        columnHeader['URL'.success] = item.serviceUrl;
        return columnHeader;
      });
      console.table(liveSchdule);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }
    return true;
  }
}
