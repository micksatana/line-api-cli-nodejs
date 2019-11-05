import 'console-table';

import Operation from '../operation';
import ThingsGetTrialOperation from '../things-get-trial-operation';

const { spyOn } = jest;

describe('things get:trial', () => {
  it('extends Operation', () => {
    expect(ThingsGetTrialOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(ThingsGetTrialOperation.usage).toEqual([
      {
        header: 'Get trial products'.help,
        content: `things get:trial`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsGetTrialOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsGetTrialOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsGetTrialOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsGetTrialOperation.validateConfig.mockRestore();
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
      spyOn(ThingsGetTrialOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsGetTrialOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list rich menus', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(ThingsGetTrialOperation.getRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(ThingsGetTrialOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        ThingsGetTrialOperation.getRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no rich menu data', () => {
      beforeEach(() => {
        console.log.mockClear();
      });

      it('handles undefined', async () => {
        spyOn(ThingsGetTrialOperation.getRequest, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(ThingsGetTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Trial product not found'.info
        );
      });

      it('handles empty array', async () => {
        spyOn(ThingsGetTrialOperation.getRequest, 'send').mockResolvedValue({
          data: []
        });
        await expect(ThingsGetTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Trial product not found'.info
        );
      });

      afterAll(() => {
        ThingsGetTrialOperation.getRequest.send.mockRestore();
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
      const expectedRow = {};

      beforeAll(() => {
        spyOn(ThingsGetTrialOperation.getRequest, 'send').mockResolvedValue(
          mockResponse
        );
        expectedRow['ID'.success] = mockResponse.data[0].id;
        expectedRow['Name'.success] = mockResponse.data[0].name;
        expectedRow['Type'.success] = mockResponse.data[0].type;
        expectedRow['Channel ID'.success] = mockResponse.data[0].channelId;
        expectedRow['Service UUID'.success] = mockResponse.data[0].serviceUuid;
        expectedRow['PSDI Service UUID'.success] =
          mockResponse.data[0].psdiServiceUuid;
        expectedRow['PSDI Characteristic UUID'.success] =
          mockResponse.data[0].psdiCharacteristicUuid;
      });

      it('handles error', async () => {
        await expect(ThingsGetTrialOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith([expectedRow]);
      });

      afterAll(() => {
        ThingsGetTrialOperation.getRequest.send.mockRestore();
      });
    });

    afterAll(() => {
      ThingsGetTrialOperation.config.mockRestore();
      ThingsGetTrialOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
