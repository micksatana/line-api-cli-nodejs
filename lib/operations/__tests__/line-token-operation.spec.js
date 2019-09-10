import LINETokenOperation from '../line-token-operation';
import { EOL } from 'os';

describe('line token', () => {
  it('has usage', () => {
    expect(LINETokenOperation.usage).toEqual([
      {
        header: 'Issue/Revoke access token '.help,
        content:
          `After channel ID and secret are configured. Issue a channel access token and save it.` +
          EOL +
          EOL +
          `line token --issue --save`.code +
          EOL +
          EOL +
          `In case you want to revoke an access token, you can run with --revoke option.` +
          EOL +
          EOL +
          `line token --revoke`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'issue'.code,
            description:
              'Issue a channel access token from pre-configured channel ID and secret'
          },
          {
            name: 'save'.code,
            description:
              'Apply along with --issue option, the new access token will be replace in project configuration file.'
          },
          {
            name: 'revoke'.code,
            typeLabel: '{underline accessToken}'.input,
            description: 'Revoke a channel access token.'
          }
        ]
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETokenOperation.run).toEqual('function');
  });
});
