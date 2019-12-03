import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsGetScenarioSetOperation from '../things-get-scenario-set-operation';

const { spyOn, mock, unmock } = jest;

describe('things get:scenario-set', () => {
  it('extends Operation', () => {
    expect(
      ThingsGetScenarioSetOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsGetScenarioSetOperation.usage).toEqual([
      {
        header: 'Get the scenario set registered under a product'.help,
        content: `things get:scenario-set`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsGetScenarioSetOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsGetScenarioSetOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(ThingsGetScenarioSetOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsGetScenarioSetOperation.validateConfig.mockRestore();
    });
  });

  describe('when config is valid', () => {
    const mockConfig = {
      channel: {
        id: 1234,
        secret: 'mock secret',
        accessToken: 'mock access token'
      }
    };

    beforeAll(() => {
      spyOn(ThingsGetScenarioSetOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsGetScenarioSetOperation, 'validateConfig').mockReturnValue(
        true
      );
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('prompts for product ID', () => {
      const productIdPrompt = {
        type: 'text',
        name: 'productId',
        message: 'Product ID?'
      };
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
      });

      describe('when user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            ThingsGetScenarioSetOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            ThingsGetScenarioSetOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsGetScenarioSetOperation.cancelOption
          );
          expect(
            ThingsGetScenarioSetOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          ThingsGetScenarioSetOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when product ID is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValue({ productId: '' });
        });

        it('resolves false', async () => {
          await expect(ThingsGetScenarioSetOperation.run()).resolves.toEqual(
            false
          );
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsGetScenarioSetOperation.cancelOption
          );
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      describe('when product ID not empty', () => {
        const mockResponse = {};

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ productId: '0123456789' });
          spyOn(
            ThingsGetScenarioSetOperation,
            'logAxiosResponse'
          ).mockReturnValue();
          spyOn(ThingsGetScenarioSetOperation.request, 'send').mockResolvedValue(
            mockResponse
          );
        });

        it('handles correctly', async () => {
          await expect(ThingsGetScenarioSetOperation.run()).resolves.toEqual(
            true
          );
          expect(ThingsGetScenarioSetOperation.request.send).toHaveBeenCalledWith(
            '0123456789'
          );
          expect(
            ThingsGetScenarioSetOperation.logAxiosResponse
          ).toHaveBeenCalledWith(mockResponse);
        });

        afterAll(() => {
          ThingsGetScenarioSetOperation.request.mockRestore();
          ThingsGetScenarioSetOperation.logAxiosResponse.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when failed to send the request', () => {
        const error = new Error('failed');

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ productId: '0123456789' });
          spyOn(
            ThingsGetScenarioSetOperation,
            'logAxiosError'
          ).mockReturnValue();
          spyOn(ThingsGetScenarioSetOperation.request, 'send').mockRejectedValue(
            error
          );
        });

        it('handles correctly', async () => {
          await expect(ThingsGetScenarioSetOperation.run()).resolves.toEqual(
            false
          );
          expect(ThingsGetScenarioSetOperation.request.send).toHaveBeenCalledWith(
            '0123456789'
          );
          expect(ThingsGetScenarioSetOperation.logAxiosError).toHaveBeenCalledWith(error);
        });

        afterAll(() => {
          ThingsGetScenarioSetOperation.request.mockRestore();
          ThingsGetScenarioSetOperation.logAxiosError.mockRestore();
          prompts.mockReset();
        });
      });

      afterAll(() => {
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsGetScenarioSetOperation.config.mockRestore();
      ThingsGetScenarioSetOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
