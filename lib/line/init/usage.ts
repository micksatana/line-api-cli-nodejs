import { cyan, green } from 'colors/safe';

import { CONFIG_FILE_NAME } from '../../config';
import { EOL } from 'os';
import { Section } from 'command-line-usage';
import { printUsage } from '../print-usage';

export const usage: Section[] = [
  {
    header: green('Initialize configuration file for LINE API CLIs'),
    content:
      'Initialize configuration file' +
      EOL +
      EOL +
      cyan('line init') +
      EOL +
      EOL +
      `This command should be run first time under project root folder. After run successfully, you will get ${CONFIG_FILE_NAME} configuration file`
  }
];

export const print = printUsage(usage);
