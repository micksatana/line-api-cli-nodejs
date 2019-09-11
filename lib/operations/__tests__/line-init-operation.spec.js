import fs from 'fs';
import yaml from 'js-yaml';
import LINEInitOperation from '../line-init-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('LINEInitOperation', () => {
  let prompts;

  beforeAll(() => {
    mock('prompts');
    prompts = require('prompts');
    spyOn(console, 'log').mockReturnValue(undefined);
  });

  it('extends Operation', () => {
    expect(LINEInitOperation.prototype instanceof Operation).toEqual(true);
  });

  describe('run', () => {
    const mockConfig = {
      channel: {
        id: 1234,
        secret: 'testsecret',
        accessToken: 'testaccesstoken'
      }
    };
    const mockYamlDump = 'mock yaml dump';

    describe('when .line-api-cli.yml exists', () => {
      beforeAll(() => {
        spyOn(fs, 'existsSync').mockReturnValue(true);
      });

      describe('and user choose not to overwrite', () => {
        beforeAll(() => {
          prompts.mockClear();
          prompts.mockResolvedValueOnce({ overwrite: false });
        });

        it('display', async () => {
          await expect(LINEInitOperation.run()).resolves.toEqual(false);
          expect(fs.existsSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`
          );
          expect(prompts).toHaveBeenCalledWith({
            type: 'toggle',
            name: 'overwrite',
            message: 'Do you want to overwrite?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
          });
        });
      });

      describe('and user choose to overwrite', () => {
        beforeAll(() => {
          prompts.mockClear();
          prompts
            .mockResolvedValueOnce({ overwrite: true })
            .mockResolvedValueOnce({ id: mockConfig.channel.id })
            .mockResolvedValueOnce({ secret: mockConfig.channel.secret })
            .mockResolvedValueOnce({ hasLongLivedAccessToken: true })
            .mockResolvedValueOnce({
              accessToken: mockConfig.channel.accessToken
            });
          spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
          spyOn(yaml, 'safeDump').mockReturnValue(mockYamlDump);
        });

        it('display', async () => {
          await expect(LINEInitOperation.run()).resolves.toEqual(true);
          expect(fs.existsSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`
          );
          expect(prompts).toHaveBeenCalledWith({
            type: 'toggle',
            name: 'overwrite',
            message: 'Do you want to overwrite?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
          });
          expect(yaml.safeDump).toHaveBeenCalledWith(mockConfig);
          expect(fs.writeFileSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`,
            mockYamlDump
          );
        });

        afterAll(() => {
          fs.writeFileSync.mockRestore();
          yaml.safeDump.mockRestore();
        });
      });

      afterAll(() => {
        fs.existsSync.mockRestore();
      });
    });

    describe('when .line-api-cli.yml does not exist', () => {
      beforeAll(() => {
        spyOn(fs, 'existsSync').mockReturnValue(false);
        spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
        spyOn(yaml, 'safeDump').mockReturnValue(mockYamlDump);
      });

      beforeEach(() => {
        fs.existsSync.mockClear();
        fs.writeFileSync.mockClear();
        yaml.safeDump.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockClear();
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
            return Promise.resolve({});
          });

          spyOn(process, 'exit').mockReturnValue(undefined);
        });

        it('exit', async () => {
          await expect(LINEInitOperation.run()).rejects.toEqual(
            // Don't care the rest because process already exits in actual program
            expect.anything()
          );
          expect(fs.existsSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`
          );
          expect(process.exit).toHaveBeenCalledWith(0);
        });

        afterAll(() => {
          process.exit.mockRestore();
        });
      });

      describe('and user answers all questions', () => {
        beforeAll(() => {
          prompts.mockClear();
          prompts
            .mockResolvedValueOnce({ id: mockConfig.channel.id })
            .mockResolvedValueOnce({ secret: mockConfig.channel.secret })
            .mockResolvedValueOnce({ hasLongLivedAccessToken: true })
            .mockResolvedValueOnce({
              accessToken: mockConfig.channel.accessToken
            });
        });

        it('ask init questions', async () => {
          await expect(LINEInitOperation.run()).resolves.toEqual(true);
          expect(prompts.mock.calls[0][0]).toEqual({
            type: 'number',
            name: 'id',
            message: 'Channel ID?',
            hint:
              'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
          });
          expect(prompts.mock.calls[1][0]).toEqual({
            type: 'text',
            name: 'secret',
            message: 'Channel Secret?'
          });
          expect(prompts.mock.calls[2][0]).toEqual({
            type: 'toggle',
            name: 'hasLongLivedAccessToken',
            message: 'Do you have long-lived access token?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
          });
          expect(prompts.mock.calls[3][0]).toEqual({
            type: 'text',
            name: 'accessToken',
            message: 'Long-lived access token?'
          });
          expect(fs.existsSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`
          );
          expect(yaml.safeDump).toHaveBeenCalledWith(mockConfig);
          expect(fs.writeFileSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`,
            mockYamlDump
          );
        });
      });

      describe('and user not specify long-lived access token', () => {
        beforeAll(() => {
          prompts.mockClear();
          prompts
            .mockResolvedValueOnce({ id: mockConfig.channel.id })
            .mockResolvedValueOnce({ secret: mockConfig.channel.secret })
            .mockResolvedValueOnce({ hasLongLivedAccessToken: false });
        });

        it('ask init questions', async () => {
          await expect(LINEInitOperation.run()).resolves.toEqual(true);
          expect(prompts.mock.calls[0][0]).toEqual({
            type: 'number',
            name: 'id',
            message: 'Channel ID?',
            hint:
              'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
          });
          expect(prompts.mock.calls[1][0]).toEqual({
            type: 'text',
            name: 'secret',
            message: 'Channel Secret?'
          });
          expect(prompts.mock.calls[2][0]).toEqual({
            type: 'toggle',
            name: 'hasLongLivedAccessToken',
            message: 'Do you have long-lived access token?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
          });
          expect(prompts).not.toHaveBeenCalledWith(
            {
              type: 'text',
              name: 'accessToken',
              message: 'Long-lived access token?'
            },
            expect.anything()
          );
          expect(fs.existsSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`
          );
          expect(yaml.safeDump).toHaveBeenCalledWith({
            channel: {
              id: mockConfig.channel.id,
              secret: mockConfig.channel.secret,
              accessToken: ''
            }
          });
          expect(fs.writeFileSync).toHaveBeenCalledWith(
            `./${LINEInitOperation.configFileName}`,
            mockYamlDump
          );
        });
      });

      afterAll(() => {
        fs.existsSync.mockRestore();
        fs.writeFileSync.mockRestore();
        yaml.safeDump.mockRestore();
      });
    });
  });

  afterAll(() => {
    prompts.mockRestore();
    unmock('prompts');
    console.log.mockRestore();
  });
});
