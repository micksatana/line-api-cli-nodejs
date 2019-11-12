import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsRemoveTrialOperation from '../things-remove-trial-operation';

const { spyOn, mock, unmock } = jest;

describe('things remove:trial', () => {
  it('extends Operation', () => {
    expect(ThingsRemoveTrialOperation.prototype instanceof ThingsOperation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(ThingsRemoveTrialOperation.usage).toEqual([
      {
        header: 'Remove a trial product'.help,
        content: `things remove:trial`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsRemoveTrialOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsRemoveTrialOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsRemoveTrialOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsRemoveTrialOperation.validateConfig.mockRestore();
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
    let prompts;

    beforeAll(() => {
      spyOn(ThingsRemoveTrialOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsRemoveTrialOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list trial products', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(ThingsRemoveTrialOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(ThingsRemoveTrialOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        ThingsRemoveTrialOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no trial product data', () => {
      beforeEach(() => {
        console.log.mockClear();
      });

      it('handles undefined', async () => {
        spyOn(ThingsRemoveTrialOperation.listRequest, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(ThingsRemoveTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Trial product not found'.info
        );
      });

      it('handles empty array', async () => {
        spyOn(ThingsRemoveTrialOperation.listRequest, 'send').mockResolvedValue({
          data: []
        });
        await expect(ThingsRemoveTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Trial product not found'.info
        );
      });

      afterAll(() => {
        ThingsRemoveTrialOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has trial products', () => {
      const productId = '6557519507539544975';
      const mockResponse = {
        data: [
          {
            id: productId,
            name: 'mickTestDevice',
            type: 'BLE',
            channelId: 1600202838,
            actionUri: 'line://app/1600202838-Ad4zPrEd',
            serviceUuid: '2391f468-ecf0-4c7e-a76b-f622108e3b23',
            psdiServiceUuid: 'e625601e-9e55-4597-a598-76018a0d293d',
            psdiCharacteristicUuid: '26e2b12b-85f0-4f3f-9fdd-91d114270e6e'
          }
        ]
      };
      const productsPrompt = {
        type: 'select',
        name: 'productId',
        message: 'Select a trial product to be removed',
        choices: [
          {
            title: `${mockResponse.data[0].name}`,
            description: `Product ID: ${mockResponse.data[0].id}`,
            value: mockResponse.data[0].id
          }
        ]
      };

      beforeAll(() => {
        spyOn(ThingsRemoveTrialOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(ThingsRemoveTrialOperation.removeRequest, 'send').mockResolvedValue(
          {}
        );
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        ThingsRemoveTrialOperation.listRequest.send.mockClear();
        ThingsRemoveTrialOperation.removeRequest.send.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            ThingsRemoveTrialOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            ThingsRemoveTrialOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(ThingsRemoveTrialOperation.listRequest.send).toHaveBeenCalled();
          expect(
            ThingsRemoveTrialOperation.removeRequest.send
          ).not.toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            productsPrompt,
            ThingsRemoveTrialOperation.cancelOption
          );
          expect(
            ThingsRemoveTrialOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          ThingsRemoveTrialOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and user choose a trial product', () => {
        describe('and able to remove the trial product', () => {
          beforeAll(() => {
            prompts.mockResolvedValueOnce({ productId });
            spyOn(
              ThingsRemoveTrialOperation.removeRequest,
              'send'
            ).mockResolvedValue({});
          });

          it('remove the trial product', async () => {
            await expect(ThingsRemoveTrialOperation.run()).resolves.toEqual(true);
            expect(ThingsRemoveTrialOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              productsPrompt,
              ThingsRemoveTrialOperation.cancelOption
            );
            expect(
              ThingsRemoveTrialOperation.removeRequest.send
            ).toHaveBeenCalledWith(productId);
          });

          afterAll(() => {
            prompts.mockReset();
            ThingsRemoveTrialOperation.removeRequest.send.mockReset();
          });
        });

        describe('and NOT able to remove the trial product', () => {
          const error = new Error('failed to remove');

          beforeAll(() => {
            prompts.mockResolvedValueOnce({ productId });
            spyOn(
              ThingsRemoveTrialOperation.removeRequest,
              'send'
            ).mockRejectedValue(error);
            spyOn(console, 'error').mockReturnValue(undefined);
          });

          it('handles error', async () => {
            await expect(ThingsRemoveTrialOperation.run()).resolves.toEqual(false);
            expect(ThingsRemoveTrialOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              productsPrompt,
              ThingsRemoveTrialOperation.cancelOption
            );
            expect(
              ThingsRemoveTrialOperation.removeRequest.send
            ).toHaveBeenCalledWith(productId);
          });

          afterAll(() => {
            console.error.mockRestore();
            prompts.mockReset();
            ThingsRemoveTrialOperation.removeRequest.send.mockReset();
          });
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      afterAll(() => {
        ThingsRemoveTrialOperation.removeRequest.send.mockRestore();
        ThingsRemoveTrialOperation.listRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsRemoveTrialOperation.config.mockRestore();
      ThingsRemoveTrialOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
