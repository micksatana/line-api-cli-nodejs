import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
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
        content: `linetv get:category`.code
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

    let categories = [];

    try {
      const listResponse = await this.listRequest.send(channelId, countryCode);

      if (!listResponse.data || listResponse.data.body === null) {
        console.log('Category list not found'.info);
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
      console.log('No category'.info);
      return true;
    }

    let page = 1;
    const { selectedCategory } = await prompts(
      {
        type: 'select',
        name: 'selectedCategory',
        message: 'Select a category',
        choices: categories
      },
      this.cancelOption
    );

    const { countPerPage } =
      (await prompts(
        {
          type: 'text',
          name: 'countPerPage',
          message: 'Number of display per page?',
          validate: countPerPage =>
            isNaN(countPerPage) || !countPerPage ? 'Please Enter Number' : true
        },
        this.cancelOption
      )) || {};

    let getResponse = await this.getRequest.send(
      channelId,
      countryCode,
      selectedCategory.categoryCode,
      page,
      countPerPage
    );
    const clip = getResponse.data.body.representClip;
    const column = {};
    column['Represent Clip No.'.success] = clip.clipNo;
    column['Represent Clip Title'.success] = clip.clipTitle;
    column['Represent Clip URL'.success] = clip.serviceUrl;
    column['Play Count'.success] = clip.playCount;
    column['Likeit Count'.success] = clip.likeitPoint;

    console.table(column);
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
