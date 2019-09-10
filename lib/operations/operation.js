import '../typedef';

import fs from 'fs';
import yaml from 'js-yaml';

export default class Operation {
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
        console.log(`Run command ${`line init`.code} to initialize project configuration file first`.help);
        process.exit(0);
      }
      try {
        this._config = yaml.safeLoad(configFile);
      } catch (error) {
        console.log('Unable to safe load configuration file', error);
        process.exit(1);
      }
    }

    return this._config;
  }
}
