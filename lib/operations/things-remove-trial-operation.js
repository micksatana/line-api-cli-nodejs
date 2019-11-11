import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import ThingsListTrialProductsRequest from '../apis/things-list-trial-products-request';
import ThingsRemoveTrialProductRequest from '../apis/things-remove-trial-product-request';

export default class ThingsRemoveTrialOperation extends ThingsOperation {
  static listRequest = new ThingsListTrialProductsRequest({
    accessToken: this.config.channel.accessToken
  });
  static removeRequest = new ThingsRemoveTrialProductRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Remove a trial product'.help,
        content: `things remove:trial`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

    let trialProducts;

    try {
      const response = await this.listRequest.send();

      trialProducts = response.data;
    } catch (error) {
      console.error(error);
      return false;
    }

    if (trialProducts && trialProducts.length) {
      trialProducts = trialProducts.map(product => {
        return {
          title: `${product.name}`,
          description: `Product ID: ${product.id}`,
          value: product.id
        };
      });
    } else {
      console.log('Trial product not found'.info);
      return true;
    }

    const { productId } = await prompts(
      {
        type: 'select',
        name: 'productId',
        message: 'Select a trial product to be removed',
        choices: trialProducts
      },
      this.cancelOption
    );

    try {
      await this.removeRequest.send(productId);
      console.log(`Removed trial product ID: ${productId.code}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
