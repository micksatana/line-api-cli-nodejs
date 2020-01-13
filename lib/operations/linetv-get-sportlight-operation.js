import '../typedef';
import 'console.table';
import { Section } from 'command-line-usage';
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
        content: `linetv get:spotlight`.code
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

    const { moduleName } = await prompts(
      {
        type: 'select',
        name: 'moduleName',
        message: 'Select a module',
        choices: modules
      },
      this.cancelOption
    );
    const getResponse = await this.getRequest.send(channelId, moduleName.name);
    switch (moduleName.dataModel) {
      case 'clip': {
        const spotlightClip = getResponse.data.body.clips.map(item => {
          const columnHeader = {};
          columnHeader['Clip Number'.success] = item.clipNo;
          columnHeader['Title'.success] = item.clipTitle;
          columnHeader['Play Count'.success] = item.playCount;
          columnHeader['Like Point'.success] = item.likeitPoint;
          return columnHeader;
        });
        console.table(spotlightClip);
        break;
      }
      case 'playlist': {
        const spotlightPlaylist = getResponse.data.body.playlists;
        // @TODO -- Make list selector and display play-list
        console.log(JSON.stringify(spotlightPlaylist, null, 2));
        break;
      }
      case 'channel': {
        const spotlightChannel = getResponse.data.body.channels.map(item => {
          const columnHeader = {};
          columnHeader['Channel ID'.success] = item.channelId;
          columnHeader['Channel Name'.success] = item.channelName;
          columnHeader['URL'.success] = item.serviceUrl;
          return columnHeader;
        });
        console.table(spotlightChannel);
        break;
      }
      default:
        console.error('Data model not implemented');
        return false;
    }
    return true;
  }
}
