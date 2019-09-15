import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LIFFListRequest from '../apis/liff-list-request';
import LIFFRemoveRequest from '../apis/liff-remove-request';

export default class LIFFRemoveOperation extends Operation {
  static listRequest = new LIFFListRequest({
    accessToken: this.config.channel.accessToken
  });
  static removeRequest = new LIFFRemoveRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Remove a LIFF app'.help,
        content: `liff remove`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let apps = [];

    try {
      const response = await this.listRequest.send();

      apps = response.data.apps || [];
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!apps.length) {
      console.log('LIFF app not found'.info);
      return true;
    }

    const choices = apps.map(app => {
      return {
        title: `${app.view.type} ${app.view.url} [${app.liffId}]`,
        description: app.description,
        value: app.liffId
      };
    });

    const prompts = require('prompts');

    const { liffId } = await prompts(
      {
        type: 'select',
        name: 'liffId',
        message: 'Select a LIFF app to be removed',
        choices
      },
      this.cancelOption
    );

    try {
      await this.removeRequest.send(liffId);
      console.log(`Removed LIFF app ID: ${liffId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
