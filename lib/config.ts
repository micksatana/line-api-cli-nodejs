import { readFileSync } from 'fs';
import colors from 'colors/safe';
import { load } from 'js-yaml';

let _config: Config;

export const CONFIG_FILE_NAME = '.line-api-cli.yml';

export interface ChannelConfig {
  id: number;
  secret: string;
  accessToken: string;
}

export interface Config {
  channel: ChannelConfig;
}

export const config = () => {
  if (!_config) {
    let configFile;
    try {
      configFile = readFileSync(`./${CONFIG_FILE_NAME}`);
    } catch (_) {
      console.log(
        colors.green(
          `Run command ${colors.cyan(
            'line init'
          )} to initialize project configuration file`
        )
      );
      process.exit(0);
    }
    try {
      _config = load(configFile);
    } catch (error) {
      console.log('Unable to safe load configuration file', error);
      process.exit(1);
    }
  }

  return _config;
};
