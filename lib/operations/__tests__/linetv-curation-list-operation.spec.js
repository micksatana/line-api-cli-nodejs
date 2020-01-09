import 'console-table';

import LINETvCurationListOperation from '../linetv-curation-list-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:curation', () => {
  it('extends Operation', () => {
    expect(LINETvCurationListOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvCurationListOperation.usage).toEqual([
      {
        header: 'List curation module types'.help,
        content: `linetv list:curation`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvCurationListOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvCurationListOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(LINETvCurationListOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvCurationListOperation.validateConfig.mockRestore();
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
      spyOn(LINETvCurationListOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvCurationListOperation, 'validateConfig').mockReturnValue(
        true
      );
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list curation', () => {
      const error = new Error('list failed');
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvCurationListOperation.request, 'send').mockRejectedValue(
          error
        );
        spyOn(LINETvCurationListOperation, 'logAxiosError').mockReturnValue(
          undefined
        );
      });

      it('handles error', async () => {
        await expect(LINETvCurationListOperation.run()).resolves.toEqual(false);
        expect(LINETvCurationListOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvCurationListOperation.request.send.mockRestore();
        console.error.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    xdescribe('when no curation data', () => {
      beforeEach(() => {
        console.log.mockClear();
      });

      it('handles undefined', async () => {
        spyOn(LINETvCurationListOperation.request, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(LINETvCurationListOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Curation list not found'.info
        );
      });

      afterAll(() => {
        LINETvCurationListOperation.request.send.mockRestore();
      });
    });

  

    /*
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
        spyOn(LINETvCurationListOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(LINETvCurationListOperation, 'productsToTableData').mockReturnValue([mockTableRow]);
      });

      it('display table correctly', async () => {
        await expect(LINETvCurationListOperation.run()).resolves.toEqual(true);
        expect(LINETvCurationListOperation.productsToTableData).toHaveBeenCalledWith(mockResponse.data);
        expect(console.table).toHaveBeenCalledWith([mockTableRow]);
      });

      afterAll(() => {
        LINETvCurationListOperation.request.send.mockRestore();
        LINETvCurationListOperation.productsToTableData.mockRestore();
      });
    });*/

    afterAll(() => {
      LINETvCurationListOperation.config.mockRestore();
      LINETvCurationListOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
