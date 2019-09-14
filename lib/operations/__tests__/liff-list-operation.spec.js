import 'console-table';

import Operation from '../operation';
import LIFFListOperation from '../liff-list-operation';

const { spyOn } = jest;

describe('liff list', () => {
  it('extends Operation', () => {
    expect(LIFFListOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LIFFListOperation.usage).toEqual([
      {
        header: 'List LIFF apps'.help,
        content: `liff list`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LIFFListOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LIFFListOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LIFFListOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LIFFListOperation.validateConfig.mockRestore();
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
      spyOn(LIFFListOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LIFFListOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list LIFF apps', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(LIFFListOperation.listRequest, 'send').mockRejectedValue(error);
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(LIFFListOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        LIFFListOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no LIFF apps data', () => {
      const mockResponse = {
        data: {
          apps: []
        }
      };

      beforeAll(() => {
        spyOn(LIFFListOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('handles error', async () => {
        await expect(LIFFListOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
      });

      afterAll(() => {
        LIFFListOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has LIFF apps', () => {
      const apps = [
        {
          liffId: 'xxxx',
          view: {
            type: 'full',
            url: 'https://www.intocode.io'
          },
          description: 'With BLE',
          features: {
            ble: true
          }
        },
        {
          liffId: 'yyyy',
          view: {
            type: 'full',
            url: 'https://www.intocode.io'
          },
          description: 'Without BLE'
        }
      ];
      const mockResponse = {
        data: {
          apps
        }
      };
      let expectedRows;

      beforeAll(() => {
        spyOn(LIFFListOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        expectedRows = apps.map(app => {
          const row = {};

          row['LIFF app ID'.success] = app.liffId;
          row['Type'.success] = app.view.type;
          row['URL'.success] = app.view.url;
          row['Description'.success] = app.description;
          row['BLE'.success] =
            app.features && app.features.ble ? '\u2713' : '\u2715';

          return row;
        });
      });

      it('handles error', async () => {
        await expect(LIFFListOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedRows);
      });

      afterAll(() => {
        LIFFListOperation.listRequest.send.mockRestore();
      });
    });

    afterAll(() => {
      LIFFListOperation.config.mockRestore();
      LIFFListOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
