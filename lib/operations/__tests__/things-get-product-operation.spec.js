import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsGetProductOperation from '../things-get-product-operation';

const { spyOn, mock, unmock } = jest;

describe('things get:product', () => {
  it('extends Operation', () => {
    expect(
      ThingsGetProductOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsGetProductOperation.usage).toEqual([
      {
        header: 'Specify the device ID, and acquire the product ID and PSDI'
          .help,
        content: `things get:product`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsGetProductOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsGetProductOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsGetProductOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsGetProductOperation.validateConfig.mockRestore();
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
      spyOn(ThingsGetProductOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsGetProductOperation, 'validateConfig').mockReturnValue(true);
    });

    describe('prompt for device ID', () => {
      const deviceIDPrompt = {
        type: 'text',
        name: 'deviceId',
        message: 'Device ID?'
      };
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
      });

      describe('when cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            ThingsGetProductOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
          spyOn(ThingsGetProductOperation.getRequest, 'send').mockRejectedValue(
            new Error('should not be called')
          );
          spyOn(console, 'log').mockReturnValue();
        });

        it('exits gracefully', async () => {
          await expect(ThingsGetProductOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            deviceIDPrompt,
            ThingsGetProductOperation.cancelOption
          );
          expect(
            ThingsGetProductOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
          expect(
            ThingsGetProductOperation.getRequest.send
          ).not.toHaveBeenCalled();
          expect(console.log).toHaveBeenCalledWith(
            'Device ID cannot be empty'.error
          );
        });

        afterAll(() => {
          console.log.mockRestore();
          ThingsGetProductOperation.getRequest.send.mockRestore();
          ThingsGetProductOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when able to get device ID', () => {
        const deviceId = 'xxxx';
        const mockResponse = {
          data: {}
        };

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ deviceId });
          spyOn(ThingsGetProductOperation.getRequest, 'send').mockResolvedValue(
            mockResponse
          );
          spyOn(console, 'log').mockReturnValue();
        });

        it('display data correctly', async () => {
          await expect(ThingsGetProductOperation.run()).resolves.toEqual(true);
          expect(
            ThingsGetProductOperation.getRequest.send
          ).toHaveBeenCalledWith(deviceId);
          expect(console.log).toHaveBeenCalledWith(mockResponse.data);
        });

        afterAll(() => {
          ThingsGetProductOperation.getRequest.send.mockRestore();
          console.log.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when failed to get device ID', () => {
        const deviceId = 'xxxx';
        const error = new Error('failed to get data');

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ deviceId });
          spyOn(ThingsGetProductOperation.getRequest, 'send').mockRejectedValue(
            error
          );
          spyOn(ThingsGetProductOperation, 'logAxiosError').mockReturnValue();
        });

        it('handles error', async () => {
          await expect(ThingsGetProductOperation.run()).resolves.toEqual(false);
          expect(
            ThingsGetProductOperation.getRequest.send
          ).toHaveBeenCalledWith(deviceId);
          expect(ThingsGetProductOperation.logAxiosError).toHaveBeenCalledWith(
            error
          );
        });

        afterAll(() => {
          ThingsGetProductOperation.getRequest.send.mockRestore();
          ThingsGetProductOperation.logAxiosError.mockRestore();
          prompts.mockReset();
        });
      });

      afterAll(() => {
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsGetProductOperation.config.mockRestore();
      ThingsGetProductOperation.validateConfig.mockRestore();
    });
  });
});
