import 'console.table';
import { Section } from 'command-line-usage';

import ThingsOperation from './things-operation';

import LIFFListRequest from '../apis/liff-list-request';
import ThingsAddTrialRequest from '../apis/things-add-trial-request';

export default class ThingsAddTrialOperation extends ThingsOperation {
  static listRequest = new LIFFListRequest({
    accessToken: this.config.channel.accessToken
  });
  static addRequest = new ThingsAddTrialRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Add a trial product'.help,
        content: `things add:trial`.code
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
        value: app.liffId
      };
    });

    const prompts = require('prompts');

    const { liffId } = await prompts(
      {
        type: 'select',
        name: 'liffId',
        message: 'Select a LIFF app to add a trial product',
        choices
      },
      this.cancelOption
    );

    const { productName } = await prompts(
      {
        type: 'text',
        name: 'productName',
        message: 'Product name?'
      },
      this.cancelOption
    );

    if (!productName) {
      console.log('Product name cannot be empty'.error);
      return false;
    }

    try {
      const response = await this.addRequest.send(liffId, productName);
      console.table(ThingsOperation.productsToTableData([response.data]));
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
