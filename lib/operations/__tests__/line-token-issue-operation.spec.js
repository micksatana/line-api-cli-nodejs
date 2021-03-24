import { AxiosResponse } from 'axios';
import LINETokenOperation from '../line-token-operation';
import { advanceTo } from 'jest-date-mock';
import fs from 'fs';
import yaml from 'js-yaml';

const { spyOn, mock, unmock } = jest;

describe('line token --issue', () => {
  const mockConfig = {
    channel: { id: 1234, secret: 'mocked secret' }
  };

  beforeAll(() => {
    spyOn(console, 'log').mockReturnValue(undefined);
  });

  describe('when successfully issued a token', () => {
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
      spyOn(LINETokenOperation.issueRequest, 'send').mockResolvedValue(
        mockResponse
      );
      spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
      spyOn(yaml, 'dump').mockReturnValue(mockYamlDump);
      mock('prompts');
      prompts = require('prompts');
    });

    beforeEach(() => {
      fs.writeFileSync.mockClear();
      yaml.dump.mockClear();
      prompts.mockClear();
      console.log.mockClear();
    });

    describe('and not save to configuration file', () => {
      const save = false;

      beforeAll(() => {
        prompts.mockResolvedValueOnce({ save });
      });

      it('run correctly', async () => {
        await expect(LINETokenOperation.issue()).resolves.toEqual(true);
        expect(LINETokenOperation.issueRequest.send).toHaveBeenCalledWith(
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
        expect(yaml.dump).not.toHaveBeenCalled();
      });
    });

    describe('and save to configuration file', () => {
      const save = true;

      beforeAll(() => {
        prompts.mockResolvedValueOnce({ save });
      });

      it('run correctly', async () => {
        await expect(LINETokenOperation.issue()).resolves.toEqual(true);
        expect(LINETokenOperation.issueRequest.send).toHaveBeenCalledWith(
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
        expect(yaml.dump).toHaveBeenCalledWith(expectedConfig);
      });
    });

    afterAll(() => {
      LINETokenOperation.config.mockRestore();
      LINETokenOperation.issueRequest.send.mockRestore();
      fs.writeFileSync.mockRestore();
      yaml.dump.mockRestore();
      prompts.mockRestore();
      unmock('prompts');
    });
  });

  describe('when failed to send request', () => {
    const error = new Error('axios error');

    beforeAll(() => {
      spyOn(LINETokenOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LINETokenOperation.issueRequest, 'send').mockImplementation(() => {
        throw error;
      });
      spyOn(console, 'error').mockReturnValue(undefined);
    });

    it('run correctly', async () => {
      await expect(LINETokenOperation.issue()).resolves.toEqual(false);
      expect(console.error).toHaveBeenCalledWith(error);
    });

    afterAll(() => {
      LINETokenOperation.config.mockRestore();
      LINETokenOperation.issueRequest.send.mockRestore();
      console.error.mockRestore();
    });
  });

  afterAll(() => {
    console.log.mockRestore();
  });
});
