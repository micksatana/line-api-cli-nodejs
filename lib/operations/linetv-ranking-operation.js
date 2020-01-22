import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LINETvRankingRequest from '../apis/linetv-ranking-request';

export default class LINETvRankingOperation extends Operation {
  static request = new LINETvRankingRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Gets clip ranking data.'.help,
        content: `linetv ranking`.code
      }
    ];

    return sections;
  }

  static validateNonZero(countPerPage) {
    return countPerPage === 0 ? 'Zero is not allowed' : true;
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
    let page = 1;

    const { countryCode } = await prompts(
      {
        type: 'text',
        name: 'countryCode',
        message: `Country Code ${'ISO 3166-2'.prompt}`,
        validate: this.validateCountryCode
      },
      this.cancelOption
    );
    const { countPerPage } = await prompts(
      {
        type: 'number',
        name: 'countPerPage',
        message: 'Number of display per page?',
        initial: 10,
        validate: this.validateNonZero
      },
      this.cancelOption
    );

      /** @type {import('axios').AxiosResponse<LINETvRankingResponseData>} */
      let response = await this.request.send(
        channelId,
        countryCode,
        page,
        countPerPage
      );
      if (!response.data || response.data.body === null) {
        console.log('Ranking clips not found'.warn);
        return true;
      }

      const rankingClips = response.data.body.clips.map(item => {
        const columnHeader = {};
        columnHeader['Clip Number'.success] = item.clipNo;
        columnHeader['Title'.success] = item.clipTitle;
        columnHeader['Play Count'.success] = item.playCount;
        columnHeader['Like Point'.success] = item.likeitPoint;
        return columnHeader;
      });

      console.table(rankingClips);

      while (response.data.body.hasMore) {
        const { nextPage } = await prompts(
          {
            type: 'toggle',
            name: 'nextPage',
            message: 'Next Page ?',
            initial: true,
            active: 'yes',
            inactive: 'no'
          },
          this.cancelOption
        );
        if (nextPage) {
          page = page + 1;
          try {
            response = await this.request.send(
              channelId,
              countryCode,
              page,
              countPerPage
            );
          } catch (error) {
            this.logAxiosError(error);
            return false;
          }
          console.table(
            response.data.body.clips.map(item => {
              const columnHeader = {};
              columnHeader['Clip Number'.success] = item.clipNo;
              columnHeader['Title'.success] = item.clipTitle;
              columnHeader['Play Count'.success] = item.playCount;
              columnHeader['Like Point'.success] = item.likeitPoint;
              return columnHeader;
            })
          );
        } else {
          return true;
        }
      }
      console.log('No more page'.info);
      return true;
      
  }
}
