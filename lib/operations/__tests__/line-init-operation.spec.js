import fs from 'fs';
import yaml from 'js-yaml';
import LINEInitOperation from '../line-init-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('LINEInitOperation', () => {
  beforeAll(() => {
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
    let prompts;

    describe('when .line-api-cli.yml exists', () => {
      beforeAll(() => {
        spyOn(fs, 'existsSync').mockReturnValue(true);

        mock('prompts');
        prompts = require('prompts');
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
        prompts.mockRestore();
        unmock('prompts');
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

      describe('and user answers all questions', () => {
        beforeAll(() => {
          mock('prompts');
          prompts = require('prompts');
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
          expect(prompts).toHaveBeenCalledWith({
            type: 'number',
            name: 'id',
            message: 'Channel ID?',
            hint:
              'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
          });
          expect(prompts).toHaveBeenCalledWith({
            type: 'text',
            name: 'secret',
            message: 'Channel Secret?'
          });
          expect(prompts).toHaveBeenCalledWith({
            type: 'toggle',
            name: 'hasLongLivedAccessToken',
            message: 'Do you have long-lived access token?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
          });
          expect(prompts).toHaveBeenCalledWith({
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

        afterAll(() => {
          prompts.mockRestore();
          unmock('prompts');
        });
      });

      describe('and user not specify long-lived access token', () => {
        beforeAll(() => {
          mock('prompts');
          prompts = require('prompts');
          prompts
            .mockResolvedValueOnce({ id: mockConfig.channel.id })
            .mockResolvedValueOnce({ secret: mockConfig.channel.secret })
            .mockResolvedValueOnce({ hasLongLivedAccessToken: false });
        });

        it('ask init questions', async () => {
          await expect(LINEInitOperation.run()).resolves.toEqual(true);
          expect(prompts).toHaveBeenCalledWith({
            type: 'number',
            name: 'id',
            message: 'Channel ID?',
            hint:
              'You can find Channel ID and Secret at https://manager.line.biz/account/<Account ID>/setting/messaging-api'
          });
          expect(prompts).toHaveBeenCalledWith({
            type: 'text',
            name: 'secret',
            message: 'Channel Secret?'
          });
          expect(prompts).toHaveBeenCalledWith({
            type: 'toggle',
            name: 'hasLongLivedAccessToken',
            message: 'Do you have long-lived access token?',
            initial: false,
            active: 'Yes',
            inactive: 'No'
          });
          expect(prompts).not.toHaveBeenCalledWith({
            type: 'text',
            name: 'accessToken',
            message: 'Long-lived access token?'
          });
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

        afterAll(() => {
          prompts.mockRestore();
          unmock('prompts');
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
    console.log.mockRestore();
  });
});
