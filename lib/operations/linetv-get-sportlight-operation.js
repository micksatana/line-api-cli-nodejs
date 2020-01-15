import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
import { EOL } from 'os';
import Operation from './operation';
import LINETvListModulesRequest from '../apis/linetv-list-modules-request';
import LINETvGetSpotlightRequest from '../apis/linetv-get-sportlight-request';

export default class LINETvGetSpotlightOperation extends Operation {
  static listRequest = new LINETvListModulesRequest({
    accessToken: this.config.channel.accessToken
  });
  static getRequest = new LINETvGetSpotlightRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Gets spotlight data'.help,
        content:
          `To display spotlight data in table` +
          EOL +
          EOL +
          `linetv get:spotlight`.code +
          EOL +
          EOL +
          `To get spotlight data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv get:sportlight --format json`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'format'.code,
            description: 'To display data in JSON format'
          }
        ]
      }
    ];

    return sections;
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
          message: 'Country Code?'
        },
        this.cancelOption
      )) || {};

    let modules = [];

    try {
      const listResponse = await this.listRequest.send(channelId, countryCode);

      modules = listResponse.data.body.supportModule
        ? listResponse.data.body.supportModule.map(menu => {
            return {
              title: menu.name,
              description: menu.dataModel,
              value: menu
            };
          })
        : [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!modules.length) {
      console.log('Modules not found'.info);
      return true;
    }

    const { menu } = await prompts(
      {
        type: 'select',
        name: 'menu',
        message: 'Select a module',
        choices: modules
      },
      this.cancelOption
    );
    const getResponse = await this.getRequest.send(
      channelId,
      countryCode,
      menu.name
    );

    if (options.format === 'json') {
      console.log(JSON.stringify(getResponse.data, null, 2));
      return true;
    }

    let rows;

    if (!getResponse.data.body) {
      rows = [];
    } else {
      switch (menu.dataModel) {
        case 'clip':
          rows = getResponse.data.body.clips
            ? getResponse.data.body.clips.map(item => {
                const columnHeader = {};
                columnHeader['Clip Number'.success] = item.clipNo;
                columnHeader['Title'.success] = item.clipTitle;
                columnHeader['Play Count'.success] = item.playCount;
                columnHeader['Like Point'.success] = item.likeitPoint;
                return columnHeader;
              })
            : [];
          break;

        case 'channel':
          rows = getResponse.data.body.channels
            ? getResponse.data.body.channels.map(item => {
                const columnHeader = {};
                columnHeader['Channel ID'.success] = item.channelId;
                columnHeader['Channel Name'.success] = item.channelName;
                columnHeader['URL'.success] = item.serviceUrl;
                return columnHeader;
              })
            : [];
          break;

        case 'playlist':
          rows = getResponse.data.body.playlists
            ? getResponse.data.body.playlists.map(item => {
                const columnHeader = {};
                columnHeader['Title'.success] = item.title;
                columnHeader['Subtitle'.success] = item.subtitle;
                columnHeader['Play List Count'.success] = item.playlists.length;
                return columnHeader;
              })
            : [];
          break;

        default:
          console.error('Data model not implemented');
          return false;
      }
    }
    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('Data not found'.warn);
    }
    return true;
  }
}
