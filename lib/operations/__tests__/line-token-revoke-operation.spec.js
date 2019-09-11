import { AxiosResponse } from 'axios';
import LINETokenOperation from '../line-token-operation';

const { spyOn, mock, unmock } = jest;

describe('line token --revoke', () => {
  const mockConfig = {
    channel: { id: 1234, secret: 'mocked secret' }
  };
  const accessToken = 'mock access token';
  let prompts;

  beforeAll(() => {
    mock('prompts');
    prompts = require('prompts');
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(LINETokenOperation, 'config', 'get').mockReturnValue(mockConfig);
  });

  beforeEach(() => {
    prompts.mockClear();
    console.log.mockClear();
  });

  describe('when successfully revoked a token', () => {
    /** @type {AxiosResponse<IssuedTokenData>} */
    const mockResponse = {
      status: 200,
      data: ''
    };
    const expectedPrompt = {
      type: 'text',
      name: 'accessToken',
      message: 'Paste access token you want to revoke here'
    };

    beforeAll(() => {
      prompts.mockResolvedValueOnce({ accessToken });
      spyOn(LINETokenOperation.revokeRequest, 'send').mockResolvedValue(
        mockResponse
      );
    });

    it('run correctly', async () => {
      await expect(LINETokenOperation.revoke()).resolves.toEqual(true);
      expect(LINETokenOperation.revokeRequest.send).toHaveBeenCalledWith(
        accessToken
      );
      expect(prompts).toHaveBeenCalledWith(expectedPrompt);
    });

    afterAll(() => {
      LINETokenOperation.revokeRequest.send.mockRestore();
    });
  });

  describe('when user cancel', () => {
    beforeAll(() => {
      prompts.mockResolvedValueOnce({ accessToken: '' });
      spyOn(LINETokenOperation.revokeRequest, 'send').mockResolvedValue({});
    });

    it('run correctly', async () => {
      await expect(LINETokenOperation.revoke()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETokenOperation.revokeRequest.send.mockRestore();
    });
  });

  describe('when failed to send request', () => {
    const error = new Error('axios error');

    beforeAll(() => {
      error.response = {
        status: 400,
        statusText: 'Bad Request'
      };
      spyOn(LINETokenOperation.revokeRequest, 'send').mockImplementation(() => {
        throw error;
      });
      spyOn(console, 'error').mockReturnValue(undefined);
      prompts.mockResolvedValueOnce({ accessToken });
    });

    it('run correctly', async () => {
      await expect(LINETokenOperation.revoke()).resolves.toEqual(false);
      expect(console.error).toHaveBeenCalledWith(`${error.response.statusText} or invalid token`.error);
    });

    afterAll(() => {
      LINETokenOperation.revokeRequest.send.mockRestore();
      console.error.mockRestore();
    });
  });

  describe('when response with other than success status', () => {
    const mockResponse = {
      status: 999
    };
    beforeAll(() => {
      prompts.mockResolvedValueOnce({ accessToken });
      spyOn(LINETokenOperation.revokeRequest, 'send').mockResolvedValue(
        mockResponse
      );
    });

    it('run correctly', async () => {
      await expect(LINETokenOperation.revoke()).resolves.toEqual(false);
      expect(console.log).toHaveBeenCalledWith(
        `Response with status ${mockResponse.status}`.warn
      );
    });

    afterAll(() => {
      LINETokenOperation.revokeRequest.send.mockRestore();
    });
  });

  afterAll(() => {
    LINETokenOperation.config.mockRestore();
    console.log.mockRestore();
    prompts.mockRestore();
    unmock('prompts');
  });
});
