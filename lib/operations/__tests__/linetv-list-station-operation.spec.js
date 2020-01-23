import 'console-table';

import LINETvListStationOperation from '../linetv-list-station-operation';
import { EOL } from 'os';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:modules', () => {
  it('extends Operation', () => {
    expect(LINETvListStationOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvListStationOperation.usage).toEqual([
      {
        header: 'Gets the station home (TV station) list'.help,
        content:
          `To display station home in table` +
          EOL +
          EOL +
          `linetv list:station`.code +
          EOL +
          EOL +
          `To get station home data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv list:station --format json`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'format'.code,
            description: 'To get data in JSON format'
          }
        ]
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvListStationOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvListStationOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(LINETvListStationOperation.run({})).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvListStationOperation.validateConfig.mockRestore();
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
      spyOn(LINETvListStationOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvListStationOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when cannot get station home (TV Station) list', () => {
      const error = new Error('Cannot get station home');
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvListStationOperation.request, 'send')
          .mockResolvedValueOnce({ data: null })
          .mockResolvedValueOnce({ data: { body: null } })
          .mockRejectedValueOnce(error);
        spyOn(LINETvListStationOperation, 'logAxiosError').mockRejectedValue(
          undefined
        );
      });

      it('handles error', async () => {
        // When got no data
        await expect(LINETvListStationOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('No station home data'.warn);
        // When got empty data
        await expect(LINETvListStationOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('No station home data'.warn);
        // When got error
        await expect(LINETvListStationOperation.run({})).resolves.toEqual(
          false
        );
        expect(LINETvListStationOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvListStationOperation.request.send.mockRestore();
        console.error.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when has station home (TV Station) list', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            stations: [
              {
                stationId: 'one',
                stationName: 'One',
                stationLogo: 'https://pix.com/123.png',
                serviceUrl: 'https://tv.line.me/st/one'
              }
            ]
          }
        }
      };
      const expectedResponse = mockResponse.data.body.stations.map(item => {
        const columnHeader = {};
        columnHeader['Station ID'.success] = item.stationId;
        columnHeader['Station Name'.success] = item.stationName;
        columnHeader['Station URL'.success] = item.serviceUrl;
        return columnHeader;
      });

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvListStationOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display table correctly', async () => {
        await expect(LINETvListStationOperation.run({})).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedResponse);
      });

      afterAll(() => {
        LINETvListStationOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when input options --format json', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            stations: [
              {
                stationId: 'one',
                stationName: 'One',
                stationLogo: 'https://pix.com/123.png',
                serviceUrl: 'https://tv.line.me/st/one'
              }
            ]
          }
        }
      };
      const expectedFormatJSON = JSON.stringify(mockResponse.data, null, 2);

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvListStationOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display table correctly', async () => {
        await expect(
          LINETvListStationOperation.run({ format: 'json' })
        ).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(expectedFormatJSON);
      });

      afterAll(() => {
        LINETvListStationOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      LINETvListStationOperation.config.mockRestore();
      LINETvListStationOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});

describe('LINETvGetCategoryOperation validate 2 character country code', () => {
  it('handle 2 characters correctly', () => {
    expect(LINETvListStationOperation.validateCountryCode('cc')).toEqual(true);
  });
  it('handle error correctly', () => {
    expect(LINETvListStationOperation.validateCountryCode('ccc')).toEqual(
      'Please input ISO 3166-2 (2 characters)'
    );
  });
});
