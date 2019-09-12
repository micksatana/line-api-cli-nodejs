import { Section } from 'command-line-usage';
import path from 'path';
import Operation from './operation';
import RichMenuAddRequest from '../apis/rich-menu-add-request';
import RichMenuUploadRequest from '../apis/rich-menu-upload-request';

export default class RichmenuAddOperation extends Operation {
  static addRequest = new RichMenuAddRequest({
    accessToken: this.config.channel.accessToken
  });

  static uploadRequest = new RichMenuUploadRequest({
    accessToken: this.config.channel.accessToken
  });

  static get usage() {
    /** @type {Section[]} */
    const sections = [
      {
        header: 'Add a rich menu'.help,
        content: `richmenu add`.code
      }
    ];

    return sections;
  }

  static async run() {
    if (!this.validateConfig()) {
      return false;
    }

    const prompts = require('prompts');

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

    /** @type {{ imageFilePath:string }} */
    let { imageFilePath } = await prompts(
      {
        type: 'text',
        name: 'imageFilePath',
        message: 'Input image file path',
        validate: this.validateFileExists
      },
      this.cancelOption
    );

    if (!imageFilePath) {
      return false;
    }

    let richMenuId = '';

    try {
      const response = await this.addRequest.send(require(dataFilePath));
      richMenuId = response.data.richMenuId;
      console.log(`Rich menu ID: ${richMenuId.data}`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    try {
      await this.uploadRequest.send(richMenuId, imageFilePath);
      console.log(`Rich menu image uploaded`.success);
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
