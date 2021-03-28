import { cyan, green } from 'colors/safe';

import { load } from 'js-yaml';
import { readFileSync } from 'fs';

export const CONFIG_FILE_NAME = '.line-api-cli.yml';

export interface ChannelConfig {
  id: number;
  secret: string;
  accessToken: string;
}

export interface Config {
  channel: ChannelConfig;
}

export const loadConfig = (): Config => {
  let configFile;

  try {
    configFile = readFileSync(`./${CONFIG_FILE_NAME}`);
  } catch (_) {
    console.log(
      green(
        `Run command ${cyan(
          'line init'
        )} to initialize project configuration file`
      )
    );

    process.exit(0);
  }
  try {
    return load(configFile) as Config;
  } catch (error) {
    console.log('Unable to safe load configuration file', error);
    process.exit(1);
  }
};
