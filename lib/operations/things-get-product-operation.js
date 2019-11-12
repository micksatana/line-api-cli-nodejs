import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import ThingsGetDeviceRequest from '../apis/things-get-device-request';

export default class ThingsGetProductOperation extends ThingsOperation {
  static getRequest = new ThingsGetDeviceRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Specify the device ID, and acquire the product ID and PSDI'
          .help,
        content: `things get:product`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }
    const prompts = require('prompts');

    const { deviceId } =
      (await prompts(
        {
          type: 'text',
          name: 'deviceId',
          message: 'Device ID?'
        },
        this.cancelOption
      )) || {};

    if (!deviceId) {
      console.log('Device ID cannot be empty'.error);
      return false;
    }

    try {
      const response = await this.getRequest.send(deviceId);
      console.log(response.data);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }
}
