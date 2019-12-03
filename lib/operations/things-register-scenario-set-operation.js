import 'console.table';
import { Section } from 'command-line-usage';
import path from 'path';

import ThingsOperation from './things-operation';

import ThingsUpdateProductScenarioSetRequest from '../apis/things-update-product-scenario-set-request';

export default class ThingsRegisterScenarioSetOperation extends ThingsOperation {
  static request = new ThingsUpdateProductScenarioSetRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Register (create or update) a scenario set for automatic communication under a product'
          .help,
        content: `things register:scenario-set`.code
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

    /** @type {{ dataFilePath:string }} */
    let { dataFilePath } = await prompts(
      {
        type: 'text',
        name: 'dataFilePath',
        message: 'Input data file path',
        validate: this.validateFileExists
      },
      this.cancelOption
    );

    if (!dataFilePath) {
      return false;
    }

    if (!path.isAbsolute(dataFilePath)) {
      dataFilePath = path.resolve('./', dataFilePath);
    }

    try {
      const response = await this.request.send(
        productId,
        require(dataFilePath)
      );

      this.logAxiosResponse(response);
    } catch (error) {
      this.logAxiosError(error);
      return false;
    }

    return true;
  }
}
