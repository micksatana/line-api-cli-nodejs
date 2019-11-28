import 'console-table';
import path from 'path';

import ThingsOperation from '../things-operation';
import ThingsRegisterScenarioOperation from '../things-register-scenario-operation';

const { spyOn, mock, unmock } = jest;

describe('things register:scenarios', () => {
  it('extends Operation', () => {
    expect(
      ThingsRegisterScenarioOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsRegisterScenarioOperation.usage).toEqual([
      {
        header: 'Register (create or update) a scenario set for automatic communication under a product'
          .help,
        content: `things register:scenarios`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsRegisterScenarioOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsRegisterScenarioOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(ThingsRegisterScenarioOperation.run()).resolves.toEqual(
        false
      );
    });

    afterAll(() => {
      ThingsRegisterScenarioOperation.validateConfig.mockRestore();
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
      spyOn(ThingsRegisterScenarioOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsRegisterScenarioOperation, 'validateConfig').mockReturnValue(
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
            ThingsRegisterScenarioOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            ThingsRegisterScenarioOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsRegisterScenarioOperation.cancelOption
          );
          expect(
            ThingsRegisterScenarioOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          ThingsRegisterScenarioOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when product ID is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValue({ productId: '' });
        });

        it('resolves false', async () => {
          await expect(ThingsRegisterScenarioOperation.run()).resolves.toEqual(
            false
          );
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsRegisterScenarioOperation.cancelOption
          );
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      describe('when product ID not empty', () => {
        
        describe('prompts for data file', () => {
          const dataFilePathPrompt = {
            type: 'text',
            name: 'dataFilePath',
            message: 'Input data file path',
            validate: ThingsRegisterScenarioOperation.validateFileExists
          };

          describe('when data file path is somehow undefined', () => {
            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ productId: '0123456789' })
                .mockResolvedValueOnce({ dataFilePath: undefined });
            });

            it('returns false', async () => {
              await expect(
                ThingsRegisterScenarioOperation.run()
              ).resolves.toEqual(false);
              expect(prompts.mock.calls[0][0]).toEqual(productIdPrompt);
              expect(prompts.mock.calls[1][0]).toEqual(dataFilePathPrompt);
            });

            afterAll(() => {
              ThingsRegisterScenarioOperation.request.mockRestore();
              prompts.mockReset();
            });
          });

          describe('when data file is not absolute', () => {
            const dataFilePath = `lib/operations/__mocks__/scenario-data-file.json`;
            const mockError = new Error('some error');

            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ productId: '0123456789' })
                .mockResolvedValueOnce({ dataFilePath });
              spyOn(
                ThingsRegisterScenarioOperation.request,
                'send'
              ).mockRejectedValue(mockError);
              spyOn(
                ThingsRegisterScenarioOperation,
                'logAxiosError'
              ).mockReturnValue();
            });

            it('handles path correctly', async () => {
              await expect(
                ThingsRegisterScenarioOperation.run()
              ).resolves.toEqual(false);
              expect(prompts.mock.calls[0][0]).toEqual(productIdPrompt);
              expect(prompts.mock.calls[1][0]).toEqual(dataFilePathPrompt);
              expect(
                ThingsRegisterScenarioOperation.logAxiosError
              ).toHaveBeenCalledWith(mockError);
            });

            afterAll(() => {
              ThingsRegisterScenarioOperation.request.mockRestore();
              prompts.mockReset();
            });
          });

          describe('when user input correct absolute data file path', () => {
            const mockResponse = {};
            const dataFilePath = path.resolve(
              __dirname,
              '../__mocks__/scenario-data-file.json'
            );

            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ productId: '0123456789' })
                .mockResolvedValueOnce({ dataFilePath });
              spyOn(
                ThingsRegisterScenarioOperation,
                'logAxiosResponse'
              ).mockReturnValue(true);
              spyOn(
                ThingsRegisterScenarioOperation.request,
                'send'
              ).mockResolvedValue(mockResponse);
            });

            it('handles correctly', async () => {
              await expect(
                ThingsRegisterScenarioOperation.run()
              ).resolves.toEqual(true);
              expect(
                ThingsRegisterScenarioOperation.request.send
              ).toHaveBeenCalledWith('0123456789', require(dataFilePath));
              expect(
                ThingsRegisterScenarioOperation.logAxiosResponse
              ).toHaveBeenCalledWith(mockResponse);
            });

            afterAll(() => {
              ThingsRegisterScenarioOperation.request.mockRestore();
              ThingsRegisterScenarioOperation.logAxiosResponse.mockRestore();
              prompts.mockReset();
            });
          });
        });
      });

      afterAll(() => {
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsRegisterScenarioOperation.config.mockRestore();
      ThingsRegisterScenarioOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
