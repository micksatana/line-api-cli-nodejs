import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import ThingsListTrialProductsRequest from '../apis/things-list-trial-products-request';

export default class ThingsListTrialOperation extends ThingsOperation {
  static listRequest = new ThingsListTrialProductsRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'List trial products'.help,
        content: `things list:trial`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    let trialProducts;

    try {
      const response = await this.listRequest.send();

      trialProducts = response.data;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (trialProducts && trialProducts.length) {
      console.table(ThingsOperation.productsToTableData(trialProducts));
    } else {
      console.log('Trial product not found'.info);
      return true;
    }

    return true;
  }
}
