import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import ThingsGetDeviceRequest from '../apis/things-get-device-request';
import ThingsGetDeviceByDeviceUserRequest from '../apis/things-get-device-by-device-user-request';

export default class ThingsGetDeviceOperation extends ThingsOperation {
  static getRequest = new ThingsGetDeviceRequest({
    accessToken: this.config.channel.accessToken
  });
  static getWithUserRequest = new ThingsGetDeviceByDeviceUserRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Get device information by device ID and/or with user ID'.help,
        content: `things get:device`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }
    const prompts = require('prompts');

    const { deviceId } = await prompts(
      {
        type: 'text',
        name: 'deviceId',
        message: 'Device ID?'
      },
      this.cancelOption
    ) || {};

    if (!deviceId) {
      console.log('Device ID cannot be empty'.error);
      return false;
    }

    const { userId } = await prompts(
      {
        type: 'text',
        name: 'userId',
        message: 'Specific user ID? [Optional]'
      },
      this.cancelOption
    ) || {};

    try {
      const response = (userId) ? await this.getWithUserRequest.send(deviceId, userId) : await this.getRequest.send(deviceId);

      console.log(response.data);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }
}
