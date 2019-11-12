import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import ThingsGetDevicesByProductUserRequest from '../apis/things-get-devices-by-product-user-request';

export default class ThingsGetDevicesOperation extends ThingsOperation {
  static getRequest = new ThingsGetDevicesByProductUserRequest({
    accessToken: this.config.channel.accessToken
  });
  
  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Get device information by product ID and user ID'.help,
        content: `things get:devices`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }
    const prompts = require('prompts');

    const { productId } = await prompts(
      {
        type: 'text',
        name: 'productId',
        message: 'Product ID?'
      },
      this.cancelOption
    ) || {};

    if (!productId) {
      console.log('Product ID cannot be empty'.error);
      return false;
    }

    const { userId } = await prompts(
      {
        type: 'text',
        name: 'userId',
        message: 'User ID?'
      },
      this.cancelOption
    ) || {};

    if (!userId) {
      console.log('User ID cannot be empty'.error);
      return false;
    }

    try {
      const response = await this.getRequest.send(productId, userId);

      console.log(response.data.items);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }
}
