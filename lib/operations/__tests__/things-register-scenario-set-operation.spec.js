import 'console-table';
import path from 'path';

import ThingsOperation from '../things-operation';
import ThingsRegisterScenarioSetOperation from '../things-register-scenario-set-operation';

const { spyOn, mock, unmock } = jest;

describe('things register:scenario-set', () => {
  it('extends Operation', () => {
    expect(
      ThingsRegisterScenarioSetOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsRegisterScenarioSetOperation.usage).toEqual([
      {
        header: 'Register (create or update) a scenario set for automatic communication under a product'
          .help,
        content: `things register:scenario-set`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsRegisterScenarioSetOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsRegisterScenarioSetOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(ThingsRegisterScenarioSetOperation.run()).resolves.toEqual(
        false
      );
    });

    afterAll(() => {
      ThingsRegisterScenarioSetOperation.validateConfig.mockRestore();
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
      spyOn(ThingsRegisterScenarioSetOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsRegisterScenarioSetOperation, 'validateConfig').mockReturnValue(
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
            ThingsRegisterScenarioSetOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            ThingsRegisterScenarioSetOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsRegisterScenarioSetOperation.cancelOption
          );
          expect(
            ThingsRegisterScenarioSetOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          ThingsRegisterScenarioSetOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when product ID is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValue({ productId: '' });
        });

        it('resolves false', async () => {
          await expect(ThingsRegisterScenarioSetOperation.run()).resolves.toEqual(
            false
          );
          expect(prompts).toHaveBeenCalledWith(
            productIdPrompt,
            ThingsRegisterScenarioSetOperation.cancelOption
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
            validate: ThingsRegisterScenarioSetOperation.validateFileExists
          };

          describe('when data file path is somehow undefined', () => {
            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ productId: '0123456789' })
                .mockResolvedValueOnce({ dataFilePath: undefined });
            });

            it('returns false', async () => {
              await expect(
                ThingsRegisterScenarioSetOperation.run()
              ).resolves.toEqual(false);
              expect(prompts.mock.calls[0][0]).toEqual(productIdPrompt);
              expect(prompts.mock.calls[1][0]).toEqual(dataFilePathPrompt);
            });

            afterAll(() => {
              ThingsRegisterScenarioSetOperation.request.mockRestore();
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
                ThingsRegisterScenarioSetOperation.request,
                'send'
              ).mockRejectedValue(mockError);
              spyOn(
                ThingsRegisterScenarioSetOperation,
                'logAxiosError'
              ).mockReturnValue();
            });

            it('handles path correctly', async () => {
              await expect(
                ThingsRegisterScenarioSetOperation.run()
              ).resolves.toEqual(false);
              expect(prompts.mock.calls[0][0]).toEqual(productIdPrompt);
              expect(prompts.mock.calls[1][0]).toEqual(dataFilePathPrompt);
              expect(
                ThingsRegisterScenarioSetOperation.logAxiosError
              ).toHaveBeenCalledWith(mockError);
            });

            afterAll(() => {
              ThingsRegisterScenarioSetOperation.request.mockRestore();
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
                ThingsRegisterScenarioSetOperation,
                'logAxiosResponse'
              ).mockReturnValue(true);
              spyOn(
                ThingsRegisterScenarioSetOperation.request,
                'send'
              ).mockResolvedValue(mockResponse);
            });

            it('handles correctly', async () => {
              await expect(
                ThingsRegisterScenarioSetOperation.run()
              ).resolves.toEqual(true);
              expect(
                ThingsRegisterScenarioSetOperation.request.send
              ).toHaveBeenCalledWith('0123456789', require(dataFilePath));
              expect(
                ThingsRegisterScenarioSetOperation.logAxiosResponse
              ).toHaveBeenCalledWith(mockResponse);
            });

            afterAll(() => {
              ThingsRegisterScenarioSetOperation.request.mockRestore();
              ThingsRegisterScenarioSetOperation.logAxiosResponse.mockRestore();
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
      ThingsRegisterScenarioSetOperation.config.mockRestore();
      ThingsRegisterScenarioSetOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
