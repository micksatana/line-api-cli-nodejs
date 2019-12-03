import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsRemoveScenarioSetOperation from '../things-remove-scenario-set-operation';

const { spyOn, mock, unmock } = jest;

describe('things remove:scenario-set', () => {
  it('extends Operation', () => {
    expect(
      ThingsRemoveScenarioSetOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsRemoveScenarioSetOperation.usage).toEqual([
      {
        header: 'Delete a scenario set registered under a product'.help,
        content: `things remove:scenario-set`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsRemoveScenarioSetOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsRemoveScenarioSetOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(ThingsRemoveScenarioSetOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsRemoveScenarioSetOperation.validateConfig.mockRestore();
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
      spyOn(ThingsRemoveScenarioSetOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsRemoveScenarioSetOperation, 'validateConfig').mockReturnValue(
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
            ThingsRemoveScenarioSetOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            ThingsRemoveScenarioSetOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsRemoveScenarioSetOperation.cancelOption
          );
          expect(
            ThingsRemoveScenarioSetOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          ThingsRemoveScenarioSetOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when product ID is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValue({ productId: '' });
        });

        it('resolves false', async () => {
          await expect(ThingsRemoveScenarioSetOperation.run()).resolves.toEqual(
            false
          );
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsRemoveScenarioSetOperation.cancelOption
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
            ThingsRemoveScenarioSetOperation,
            'logAxiosResponse'
          ).mockReturnValue();
          spyOn(ThingsRemoveScenarioSetOperation.request, 'send').mockResolvedValue(
            mockResponse
          );
        });

        it('handles correctly', async () => {
          await expect(ThingsRemoveScenarioSetOperation.run()).resolves.toEqual(
            true
          );
          expect(ThingsRemoveScenarioSetOperation.request.send).toHaveBeenCalledWith(
            '0123456789'
          );
          expect(
            ThingsRemoveScenarioSetOperation.logAxiosResponse
          ).toHaveBeenCalledWith(mockResponse);
        });

        afterAll(() => {
          ThingsRemoveScenarioSetOperation.request.mockRestore();
          ThingsRemoveScenarioSetOperation.logAxiosResponse.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when failed to send the request', () => {
        const error = new Error('failed');

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ productId: '0123456789' });
          spyOn(
            ThingsRemoveScenarioSetOperation,
            'logAxiosError'
          ).mockReturnValue();
          spyOn(ThingsRemoveScenarioSetOperation.request, 'send').mockRejectedValue(
            error
          );
        });

        it('handles correctly', async () => {
          await expect(ThingsRemoveScenarioSetOperation.run()).resolves.toEqual(
            false
          );
          expect(ThingsRemoveScenarioSetOperation.request.send).toHaveBeenCalledWith(
            '0123456789'
          );
          expect(ThingsRemoveScenarioSetOperation.logAxiosError).toHaveBeenCalledWith(error);
        });

        afterAll(() => {
          ThingsRemoveScenarioSetOperation.request.mockRestore();
          ThingsRemoveScenarioSetOperation.logAxiosError.mockRestore();
          prompts.mockReset();
        });
      });

      afterAll(() => {
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsRemoveScenarioSetOperation.config.mockRestore();
      ThingsRemoveScenarioSetOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
