import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import ThingsRemoveProductScenarioSetRequest from '../apis/things-remove-product-scenario-set-request';

export default class ThingsRemoveScenarioSetOperation extends ThingsOperation {
  static request = new ThingsRemoveProductScenarioSetRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Delete a scenario set registered under a product'.help,
        content: `things remove:scenario-set`.code
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
    );

    if (!productId) {
      return false;
    }

    try {
      const response = await this.request.send(productId);

      this.logAxiosResponse(response);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }
}
