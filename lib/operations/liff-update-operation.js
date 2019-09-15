import '../typedef';

import { Section } from 'command-line-usage';
import { EOL } from 'os';
import Operation from './operation';
import LIFFUpdateRequest from '../apis/liff-update-request';
import LIFFListRequest from '../apis/liff-list-request';

export default class LIFFUpdateOperation extends Operation {
  static listRequest = new LIFFListRequest({
    accessToken: this.config.channel.accessToken
  });
  static updateRequest = new LIFFUpdateRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Update a LIFF view'.help,
        content: `liff update`.code
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
        value: app
      };
    });

    const prompts = require('prompts');

    /** @type {{app:LIFFAppData}} */
    const { app } = await prompts(
      {
        type: 'select',
        name: 'app',
        message: 'Select a LIFF app to be updated',
        choices
      },
      this.cancelOption
    );

    if (!app) {
      return false;
    }

    const viewTypes = [
      {
        title: 'compact',
        description: '50% of device screen height',
        value: 'compact'
      },
      {
        title: 'tall',
        description: '80% of device screen height',
        value: 'tall'
      },
      {
        title: 'full',
        description: '100% of device screen height',
        value: 'full'
      }
    ];

    const { viewType } = await prompts(
      {
        type: 'select',
        name: 'viewType',
        message: 'Select view type',
        choices: viewTypes,
        initial: viewTypes.reduce((init, type, i) => {
          if (type.value === app.view.type) {
            init = i;
          }
          return init;
        }, 0)
      },
      this.cancelOption
    );

    if (!viewType) {
      return false;
    }

    const { viewUrl } = await prompts(
      {
        type: 'text',
        name: 'viewUrl',
        message: 'View URL',
        initial: app.view.url
      },
      this.cancelOption
    );

    if (!viewUrl) {
      return false;
    }

    const { description } = await prompts(
      {
        type: 'text',
        name: 'description',
        message: 'View description',
        initial: app.description
      },
      this.cancelOption
    );

    if (!description) {
      return false;
    }

    const { ble } = await prompts(
      {
        type: 'toggle',
        name: 'ble',
        message:
          'Is this LIFF app supports Bluetooth® Low Energy for LINE Things',
        initial: app.features && app.features.ble ? true : false,
        active: 'Yes',
        inactive: 'No'
      },
      this.cancelOption
    );

    if (typeof ble === 'undefined') {
      return false;
    }

    const data = {
      view: {
        type: viewType,
        url: viewUrl
      },
      description,
      features: {
        ble
      }
    };

    try {
      await this.updateRequest.send(app.liffId, data);

      const row = {};

      row['LIFF app ID'.success] = app.liffId;
      row['Type'.success] = data.view.type;
      row['URL'.success] = data.view.url;
      row['Description'.success] = data.description;
      row['BLE'.success] =
        data.features && data.features.ble ? '\u2713' : '\u2715';

      console.log(EOL);
      console.table([row]);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
