import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsListTrialOperation from '../things-list-trial-operation';

const { spyOn } = jest;

describe('things list:trial', () => {
  it('extends Operation', () => {
    expect(
      ThingsListTrialOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsListTrialOperation.usage).toEqual([
      {
        header: 'List trial products'.help,
        content: `things list:trial`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsListTrialOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsListTrialOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsListTrialOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsListTrialOperation.validateConfig.mockRestore();
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
      spyOn(ThingsListTrialOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsListTrialOperation, 'validateConfig').mockReturnValue(true);
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
        spyOn(ThingsListTrialOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(ThingsListTrialOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        ThingsListTrialOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no trial product data', () => {
      beforeEach(() => {
        console.log.mockClear();
      });

      it('handles undefined', async () => {
        spyOn(ThingsListTrialOperation.listRequest, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(ThingsListTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Trial product not found'.info
        );
      });

      it('handles empty array', async () => {
        spyOn(ThingsListTrialOperation.listRequest, 'send').mockResolvedValue({
          data: []
        });
        await expect(ThingsListTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Trial product not found'.info
        );
      });

      afterAll(() => {
        ThingsListTrialOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has trial products', () => {
      const mockResponse = {
        data: [
          {
            id: '6557519507539544975',
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
      const mockTableRow = {
        ID: mockResponse.data[0].id,
        Name: mockResponse.data[0].name,
        Type: mockResponse.data[0].type,
        'Channel ID': mockResponse.data[0].channelId,
        'Service UUID': mockResponse.data[0].serviceUuid,
        'PSDI Service UUID': mockResponse.data[0].psdiServiceUuid,
        'PSDI Characteristic UUID': mockResponse.data[0].psdiCharacteristicUuid
      };

      beforeAll(() => {
        spyOn(ThingsListTrialOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(ThingsOperation, 'productsToTableData').mockReturnValue([mockTableRow]);
      });

      it('display table correctly', async () => {
        await expect(ThingsListTrialOperation.run()).resolves.toEqual(true);
        expect(ThingsOperation.productsToTableData).toHaveBeenCalledWith(mockResponse.data);
        expect(console.table).toHaveBeenCalledWith([mockTableRow]);
      });

      afterAll(() => {
        ThingsListTrialOperation.listRequest.send.mockRestore();
        ThingsOperation.productsToTableData.mockRestore();
      });
    });

    afterAll(() => {
      ThingsListTrialOperation.config.mockRestore();
      ThingsListTrialOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
