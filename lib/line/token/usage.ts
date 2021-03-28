import { cyan, green } from 'colors/safe';

import { EOL } from 'os';
import { Section } from 'command-line-usage';
import { printUsage } from '../print-usage';

export const usage: Section[] = [
  {
    header: green('Issue/Revoke/Verify access token '),
    content:
      'After channel ID and secret are configured. Issue a channel access token' +
      EOL +
      EOL +
      cyan(`line token --issue`) +
      EOL +
      EOL +
      `To revoke an access token,` +
      EOL +
      EOL +
      cyan(`line token --revoke`) +
      EOL +
      EOL +
      `To verify an access token,` +
      EOL +
      EOL +
      cyan(`line token --verify`)
  },
  {
    header: 'Options',
    optionList: [
      {
        name: cyan('issue'),
        typeLabel: ' ',
        description:
          'Issue a channel access token from pre-configured channel ID and secret'
      },
      {
        name: cyan('revoke'),
        typeLabel: ' ',
        description: 'Revoke a channel access token.'
      },
      {
        name: cyan('verify'),
        typeLabel: ' ',
        description: 'Verify a channel access token.'
      }
    ]
  }
];

export const print = printUsage(usage);
