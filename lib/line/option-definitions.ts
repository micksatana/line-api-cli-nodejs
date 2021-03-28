import { OptionDefinition } from 'command-line-args';

export const optionDefinitions: OptionDefinition[] = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'issue', type: Boolean },
  { name: 'revoke', type: Boolean },
  { name: 'verify', type: Boolean }
];
