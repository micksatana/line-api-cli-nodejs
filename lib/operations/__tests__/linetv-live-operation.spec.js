import 'console-table';

import LINETvLiveOperation from '../linetv-live-operation';
import { EOL } from 'os';
import Operation from '../operation';
import { Linter } from 'eslint';

const { spyOn, mock, unmock } = jest;

describe('linetv live', () => {
  it('extends Operation', () => {
    expect(LINETvLiveOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LINETvLiveOperation.usage).toEqual([
      {
        header: 'Gets live schedule information'.help,
        content:
          `To display live schedule in table` +
          EOL +
          EOL +
          `linetv live`.code +
          EOL +
          EOL +
          `To get live schedule data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv live --format json`.code
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
    expect(typeof LINETvLiveOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvLiveOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LINETvLiveOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvLiveOperation.validateConfig.mockRestore();
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
      spyOn(LINETvLiveOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LINETvLiveOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to get response data', () => {
      const error = new Error('Fail to get response');
      let prompts;
      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvLiveOperation, 'logAxiosError').mockRejectedValue(
          undefined
        );
        spyOn(LINETvLiveOperation.request, 'send')
          .mockResolvedValueOnce({ data: null })
          .mockResolvedValueOnce({ data: { body: null } })
          .mockRejectedValueOnce(error);
      });

      it('handles error', async () => {
        // When got no data
        await expect(LINETvLiveOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Cannot find live schdule'.warn
        );
        // When got no stations
        await expect(LINETvLiveOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Cannot find live schdule'.warn
        );
        // When got error
        await expect(LINETvLiveOperation.run({})).resolves.toEqual(false);
        expect(LINETvLiveOperation.logAxiosError).toHaveBeenCalledWith(error);
      });
      afterAll(() => {
        LINETvLiveOperation.request.send.mockRestore();
        LINETvLiveOperation.logAxiosError.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when has live station data', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            lives: [
              {
                serviceUrl: 'https://tv.line.me/special/live/123',
                channelName: 'allLive',
                liveNo: 1234,
                playCount: 123,
                thumbnailUrl: 'https://pic.net/123.jpg',
                liveStatus: 'LIVE',
                liveStartDate: '2020-01-14 22:03:00 (KST +0900)',
                liveEndDate: '2020-01-27 13:59:00 (KST +0900)',
                liveTitle: '​allLiveTitle',
                likeitPoint: 12
              }
            ]
          }
        }
      };
      const expectedLiveData = mockResponse.data.body.lives.map(item => {
        const columnHeader = {};
        columnHeader['Live No'.success] = item.liveNo;
        columnHeader['Channel Name'.success] = item.channelName;
        columnHeader['Title'.success] = item.liveTitle;
        columnHeader['Status'.success] = item.liveStatus;
        columnHeader['Start'.success] = item.liveStartDate;
        columnHeader['URL'.success] = item.serviceUrl;
        return columnHeader;
      });

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({
          countryCode: 'th'
        });
        spyOn(LINETvLiveOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display table correctly', async () => {
        await expect(LINETvLiveOperation.run({})).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedLiveData);
      });

      afterAll(() => {
        LINETvLiveOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when input options --format json', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            lives: [
              {
                serviceUrl: 'https://tv.line.me/special/live/123',
                channelName: 'allLive',
                liveNo: 1234,
                playCount: 123,
                thumbnailUrl: 'https://pic.net/123.jpg',
                liveStatus: 'LIVE',
                liveStartDate: '2020-01-14 22:03:00 (KST +0900)',
                liveEndDate: '2020-01-27 13:59:00 (KST +0900)',
                liveTitle: '​allLiveTitle',
                likeitPoint: 12
              }
            ]
          }
        }
      };
      const expectedFormatJSON = JSON.stringify(mockResponse.data, null, 2);

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({
          countryCode: 'th'
        });
        spyOn(LINETvLiveOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display data correctly', async () => {
        await expect(
          LINETvLiveOperation.run({ format: 'json' })
        ).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(expectedFormatJSON);
      });
      afterAll(() => {
        LINETvLiveOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      LINETvLiveOperation.config.mockRestore();
      LINETvLiveOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});

describe('LINETvGetCategoryOperation validate 2 character country code', () => {
  it('handle 2 characters correctly', () => {
    expect(LINETvLiveOperation.validateCountryCode('cc')).toEqual(true);
  });
  it('handle error correctly', () => {
    expect(LINETvLiveOperation.validateCountryCode('ccc')).toEqual(
      'Please input ISO 3166-2 (2 characters)'
    );
  });
});
