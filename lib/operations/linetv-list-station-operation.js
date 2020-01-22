import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LINETvListStationRequest from '../apis/linetv-list-station-request';

export default class LINETvListStationOperation extends Operation {
  static request = new LINETvListStationRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Gets the station home (TV station) list'.help,
        content: `linetv list:station`.code
      }
    ];

    return sections;
  }

  static validateCountryCode(countryCode) {
    return countryCode.length !== 2
      ? 'Please input ISO 3166-2 (2 characters)'
      : true;
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
          message: `Country Code ${'ISO 3166-2'.prompt}`,
          validate: this.validateCountryCode
        },
        this.cancelOption
      ));

    try {
      /** @type {import('axios').AxiosResponse<LINETvListStationResponseData>} */
      const response = await this.request.send(channelId, countryCode);

      if (!response.data || response.data.body === null) {
        console.log('No station home data'.warn);
        return true;
      }
      const curationModules = response.data.body.stations.map(item => {
        const columnHeader = {};
        columnHeader['Station ID'.success] = item.stationId;
        columnHeader['Station Name'.success] = item.stationName;
        columnHeader['Station URL'.success] = item.serviceUrl;
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
