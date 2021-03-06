import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import { EOL } from 'os';
import LINETvListCategoryRequest from '../apis/linetv-list-catagory-request';
import LINETvGetCategoryRequest from '../apis/linetv-get-category-request';

export default class LINETvGetCategoryOperation extends Operation {
  static listRequest = new LINETvListCategoryRequest({
    accessToken: this.config.channel.accessToken
  });
  static getRequest = new LINETvGetCategoryRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Gets category home data.'.help,
        content:
          `To display category home data in table` +
          EOL +
          EOL +
          `linetv get:category`.code +
          EOL +
          EOL +
          `To get category home data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv get:category --format json`.code +
          EOL +
          EOL +
          `To get category home data start from selected page, you can run with --page option.` +
          EOL +
          EOL +
          `linetv get:category --page <number>`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'format'.code,
            description: 'To display data in JSON format'
          },
          {
            name: 'page'.code,
            typeLabel: '{underline number}',
            description: 'To display data starts from selected page'
          }
        ]
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

    let categories = [];

    try {
      const listResponse = await this.listRequest.send(channelId, countryCode);

      if (!listResponse.data || listResponse.data.body === null) {
        console.log('Category list not found'.warn);
        return true;
      }

      categories = listResponse.data.body.tabs
        ? listResponse.data.body.tabs.map(menu => {
            return {
              title: menu.categoryCode,
              description: menu.categoryName,
              value: menu
            };
          })
        : [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!categories.length) {
      console.log('No category'.warn);
      return true;
    }

    let page = options.page || 1;
    const { selectedCategory } = await prompts(
      {
        type: 'select',
        name: 'selectedCategory',
        message: 'Select a category',
        choices: categories
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

    let getResponse = await this.getRequest.send(
      channelId,
      countryCode,
      selectedCategory.categoryCode,
      page,
      countPerPage
    );

    if (options.format === 'json') {
      console.log(JSON.stringify(getResponse.data, null, 2));
      return true;
    }

    if (page === 1) {
      const clip = getResponse.data.body.representClip;
      const representClip = [
        { ' ': 'Represent Clip No.'.success, '  ': clip.clipNo },
        { ' ': 'Represent Clip Title.'.success, '  ': clip.clipTitle },
        { ' ': 'Represent Clip URL'.success, '  ': clip.serviceUrl },
        { ' ': 'Play Count'.success, '  ': clip.playCount },
        { ' ': 'Likeit Count'.success, '  ': clip.likeitPoint }
      ];
      console.table(representClip);
    }
    console.table(
      getResponse.data.body.channels.map(item => {
        const columnHeader = {};
        columnHeader['Channel ID'.success] = item.channelId;
        columnHeader['Channel Name'.success] = item.channelName;
        columnHeader['Badge'.success] = item.badgeType;
        columnHeader['URL'.success] = item.serviceUrl;
        return columnHeader;
      })
    );

    while (getResponse.data.body.hasMore) {
      const { nextPage } = await prompts(
        {
          type: 'toggle',
          name: 'nextPage',
          message: `Current page: ${page}. Go to next page ?`,
          initial: true,
          active: 'yes',
          inactive: 'no'
        },
        this.cancelOption
      );
      if (nextPage) {
        page = page + 1;
        try {
          getResponse = await this.getRequest.send(
            channelId,
            countryCode,
            selectedCategory.categoryCode,
            page,
            countPerPage
          );
        } catch (error) {
          this.logAxiosError(error);
          return false;
        }
        console.table(
          getResponse.data.body.channels.map(item => {
            const columnHeader = {};
            columnHeader['Channel ID'.success] = item.channelId;
            columnHeader['Channel Name'.success] = item.channelName;
            columnHeader['Badge'.success] = item.badgeType;
            columnHeader['URL'.success] = item.serviceUrl;
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
