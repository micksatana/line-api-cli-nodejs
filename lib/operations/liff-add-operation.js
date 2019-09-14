import { Section } from 'command-line-usage';
import Operation from './operation';
import LIFFAddRequest from '../apis/liff-add-request';

export default class LIFFAddOperation extends Operation {
  static addRequest = new LIFFAddRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Add a LIFF view'.help,
        content: `liff add`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    const { viewType } = await prompts(
      {
        type: 'select',
        name: 'viewType',
        message: 'Select view type',
        choices: [
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
        ]
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
        message: 'View URL'
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
        message: 'View description'
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
        initial: false,
        active: 'Yes',
        inactive: 'No'
      },
      this.cancelOption
    );

    if (typeof ble === 'undefined') {
      return false;
    }

    try {
      const response = await this.addRequest.send({
        view: {
          type: viewType,
          url: viewUrl
        },
        description,
        features: {
          ble
        }
      });

      console.log(`Added LIFF ID ${response.data.liffId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
