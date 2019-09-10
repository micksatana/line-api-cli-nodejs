import { AxiosResponse } from 'axios';
import fs from 'fs';
import { advanceTo } from 'jest-date-mock';
import { EOL } from 'os';
import yaml from 'js-yaml';
import LINETokenOperation from '../line-token-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('line token', () => {
  it('extends Operation', () => {
    expect(LINETokenOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LINETokenOperation.usage).toEqual([
      {
        header: 'Issue/Revoke access token '.help,
        content:
          `After channel ID and secret are configured. Issue a channel access token and save it.` +
          EOL +
          EOL +
          `line token --issue`.code +
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

  describe('when not provided option', () => {
    const mockUsage = 'mocked usage';
    let commandLineUsage;

    beforeAll(() => {
      mock('command-line-usage');
      commandLineUsage = require('command-line-usage');
      commandLineUsage.mockReturnValue(mockUsage);

      spyOn(console, 'log').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
    });

    it('returns help', async () => {
      await expect(LINETokenOperation.run()).resolves.toEqual(false);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
    });

    it('returns help', async () => {
      await expect(LINETokenOperation.run({})).resolves.toEqual(false);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
    });

    afterAll(() => {
      commandLineUsage.mockRestore();
      unmock('command-line-usage');
      console.log.mockRestore();
    });
  });

  describe('when provided with --issue', () => {
    const mockUsage = 'mocked usage';
    const mockConfig = {
      channel: { id: 1234, secret: 'mocked secret' }
    };
    let commandLineUsage;

    beforeAll(() => {
      mock('command-line-usage');
      commandLineUsage = require('command-line-usage');
      commandLineUsage.mockReturnValue(mockUsage);

      spyOn(console, 'log').mockReturnValue(undefined);
    });

    describe('and successfully issued a token', () => {
      /** @type {AxiosResponse<IssuedTokenData>} */
      const mockResponse = {
        data: {
          access_token: 'mocked access token',
          expires_in: 20000,
          token_type: 'Bearer'
        }
      };
      const expectedConfig = {
        channel: {
          id: 1234,
          secret: 'mocked secret',
          accessToken: mockResponse.data.access_token
        }
      };
      const now = new Date();
      const expectedPrompt = {
        type: 'toggle',
        name: 'save',
        message: 'Overwrite short-lived access token to configuration file?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
      };
      const mockYamlDump = 'mock yaml';
      let prompts;

      beforeAll(() => {
        advanceTo(now);
        now.setSeconds(mockResponse.data.expires_in);
        spyOn(LINETokenOperation, 'config', 'get').mockReturnValue(mockConfig);
        spyOn(LINETokenOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
        spyOn(yaml, 'safeDump').mockReturnValue(mockYamlDump);
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        fs.writeFileSync.mockClear();
        yaml.safeDump.mockClear();
        prompts.mockClear();
        console.log.mockClear();
      });

      describe('and not save to configuration file', () => {
        const save = false;

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ save });
        });

        it('run correctly', async () => {
          await expect(
            LINETokenOperation.run({ issue: true })
          ).resolves.toEqual(true);
          expect(LINETokenOperation.request.send).toHaveBeenCalledWith(
            mockConfig.channel.id,
            mockConfig.channel.secret
          );
          expect(console.log).toHaveBeenCalledWith(
            `Access token: ${mockResponse.data.access_token.info}`.help
          );
          expect(console.log).toHaveBeenCalledWith(
            `Expiry date: ${now.toLocaleString().info}`.help
          );
          expect(prompts).toHaveBeenCalledWith(expectedPrompt);
          expect(fs.writeFileSync).not.toHaveBeenCalled();
          expect(yaml.safeDump).not.toHaveBeenCalled();
        });
      });

      describe('and save to configuration file', () => {
        const save = true;

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ save });
        });

        it('run correctly', async () => {
          await expect(
            LINETokenOperation.run({ issue: true })
          ).resolves.toEqual(true);
          expect(LINETokenOperation.request.send).toHaveBeenCalledWith(
            mockConfig.channel.id,
            mockConfig.channel.secret
          );
          expect(console.log).toHaveBeenCalledWith(
            `Access token: ${mockResponse.data.access_token.info}`.help
          );
          expect(console.log).toHaveBeenCalledWith(
            `Expiry date: ${now.toLocaleString().info}`.help
          );
          expect(prompts).toHaveBeenCalledWith(expectedPrompt);
          expect(fs.writeFileSync).toHaveBeenCalledWith(
            `./${LINETokenOperation.configFileName}`,
            mockYamlDump
          );
          expect(yaml.safeDump).toHaveBeenCalledWith(expectedConfig);
        });
      });

      afterAll(() => {
        LINETokenOperation.config.mockRestore();
        LINETokenOperation.request.send.mockRestore();
        fs.writeFileSync.mockRestore();
        yaml.safeDump.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('and failed to send request', () => {
      const error = new Error('axios error');

      beforeAll(() => {
        spyOn(LINETokenOperation, 'config', 'get').mockReturnValue(mockConfig);
        spyOn(LINETokenOperation.request, 'send').mockImplementation(() => {
          throw error;
        });
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('run correctly', async () => {
        await expect(
          LINETokenOperation.run({ issue: true })
        ).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        LINETokenOperation.config.mockRestore();
        LINETokenOperation.request.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('and failed pre-conditions', () => {
      describe('when channel ID not found', () => {
        beforeAll(() => {
          spyOn(LINETokenOperation, 'config', 'get').mockReturnValue({
            channel: {}
          });
          console.log.mockClear();
        });

        it('display suggestion', async () => {
          await expect(
            LINETokenOperation.run({ issue: true })
          ).resolves.toEqual(false);
          expect(console.log).toHaveBeenCalledWith(`Channel ID not found`.warn);
          expect(console.log).toHaveBeenCalledWith(
            `Setup channel ID at ${LINETokenOperation.configFileName.info} and re-run again`
              .help
          );
        });

        afterAll(() => {
          LINETokenOperation.config.mockRestore();
        });
      });

      describe('when channel secret not found', () => {
        beforeAll(() => {
          spyOn(LINETokenOperation, 'config', 'get').mockReturnValue({
            channel: {
              id: 1234
            }
          });
          console.log.mockClear();
        });

        it('display suggestion', async () => {
          await expect(
            LINETokenOperation.run({ issue: true })
          ).resolves.toEqual(false);
          expect(console.log).toHaveBeenCalledWith(
            `Channel secret not found`.warn
          );
          expect(console.log).toHaveBeenCalledWith(
            `Setup channel secret at ${LINETokenOperation.configFileName.info} and re-run again`
              .help
          );
        });

        afterAll(() => {
          LINETokenOperation.config.mockRestore();
        });
      });
    });

    afterAll(() => {
      commandLineUsage.mockRestore();
      unmock('command-line-usage');
      console.log.mockRestore();
    });
  });
});
