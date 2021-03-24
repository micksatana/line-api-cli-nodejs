import '../typedef';

import fs from 'fs';
import yaml from 'js-yaml';

export default class Operation {
  static cancelOption = {
    onCancel: () => process.exit(0)
  };

  static get configFileName() {
    return '.line-api-cli.yml';
  }

  /** @type {Config} */
  static _config;

  static get config() {
    if (!this._config) {
      let configFile;
      try {
        configFile = fs.readFileSync(`./${this.configFileName}`);
      } catch (_) {
        console.log(
          `Run command ${
            `line init`.code
          } to initialize project configuration file`.help
        );
        process.exit(0);
      }
      try {
        this._config = yaml.load(configFile);
      } catch (error) {
        console.log('Unable to safe load configuration file', error);
        process.exit(1);
      }
    }

    return this._config;
  }

  static validateConfig() {
    if (!this.config.channel.id || !this.config.channel.secret) {
      console.log(
        `Run command ${
          `line init`.code
        } to initialize project configuration file`.help
      );
      return false;
    }
    if (!this.config.channel.accessToken) {
      console.log(
        `Run command ${
          `line token --issue`.code
        } and save access token project configuration file`.help
      );
      return false;
    }

    return true;
  }

  static validateFileExists(value) {
    if (value) {
      return fs.existsSync(value) === true ? true : 'File not exists';
    } else {
      return 'Please input data file location to proceed.';
    }
  }

  static logAxiosError(error) {
    if (error.isAxiosError) {
      console.log(
        `${error.response.status}, ${error.response.statusText}`.error
      );

      if (
        error.response.data &&
        typeof error.response.data.detail === 'string'
      ) {
        console.log(`${error.response.data.detail}`.warn);
      }
    } else {
      console.log(error.message.error);
    }
    return;
  }

  /**
   *
   * @param {import('axios').AxiosResponse} response
   */
  static logAxiosResponse(response) {
    if (!response.data) {
      console.log(`${response.status}, ${response.statusText}`.code);
      return;
    }

    if (typeof response.data === 'object') {
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.log(`${response.data}`.code);
    }

    return;
  }
}
