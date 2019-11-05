import 'console.table';
import { Section } from 'command-line-usage';

import Operation from './operation';
import ThingsListTrialProductsRequest from '../apis/things-list-trial-products-request';

export default class ThingsListTrialOperation extends Operation {
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
      console.table(
        trialProducts.map(product => {
          const row = {};

          row['ID'.success] = product.id;
          row['Name'.success] = product.name;
          row['Type'.success] = product.type;
          row['Channel ID'.success] = product.channelId;
          row['Service UUID'.success] = product.serviceUuid;
          row['PSDI Service UUID'.success] = product.psdiServiceUuid;
          row['PSDI Characteristic UUID'.success] =
            product.psdiCharacteristicUuid;

          return row;
        })
      );
    } else {
      console.log('Trial product not found'.info);
      return true;
    }

    return true;
  }
}
