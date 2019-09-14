import 'console.table';
import { Section } from 'command-line-usage';
import Operation from './operation';
import LIFFListRequest from '../apis/liff-list-request';

export default class LIFFListOperation extends Operation {
  static listRequest = new LIFFListRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'List LIFF apps'.help,
        content: `liff list`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let apps;

    try {
      const response = await this.listRequest.send();

      apps = response.data.apps;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (!apps || apps.length === 0) {
      console.log('LIFF app not found'.info);
      return true;
    }

    console.table(
      apps.map(app => {
        const row = {};

        row['LIFF app ID'.success] = app.liffId;
        row['Type'.success] = app.view.type;
        row['URL'.success] = app.view.url;
        row['Description'.success] = app.description;
        row['BLE'.success] =
          app.features && app.features.ble ? '\u2713' : '\u2715';

        return row;
      })
    );

    return true;
  }
}
