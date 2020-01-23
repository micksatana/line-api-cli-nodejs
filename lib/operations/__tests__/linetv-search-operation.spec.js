import 'console-table';
import { EOL } from 'os';
import LINETvSearchOperation from '../linetv-search-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv ranking', () => {
  it('extends Operation', () => {
    expect(LINETvSearchOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LINETvSearchOperation.usage).toEqual([
      {
        header: 'Gets a clip search result.'.help,
        content:
          `To display clip search result in table` +
          EOL +
          EOL +
          `linetv search`.code +
          EOL +
          EOL +
          `To get clip search result in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv search --format json`.code +
          EOL +
          EOL +
          `To get clip search result start from selected page, you can run with --page option.` +
          EOL +
          EOL +
          `linetv search --page <number>`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'format'.code,
            description: 'To display data in JSON format'
          },
          {
            name: 'page'.code,
            typeLabel: '{underline number}',
            description: 'To display data starts from selected page'
          }
        ]
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvSearchOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvSearchOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LINETvSearchOperation.run({})).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvSearchOperation.validateConfig.mockRestore();
    });
  });

  describe('when config is valid', () => {
    const mockConfig = {
      channel: {
        id: 1234,
        secret: 'mocked secret',
        accessToken: 'mocked access token'
      }
    };

    beforeAll(() => {
      spyOn(LINETvSearchOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LINETvSearchOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when cannot query data', () => {
      let prompts;
      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({
            query: 'hello'
          })
          .mockResolvedValueOnce({ countPerPage: 11 })
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({
            query: 'hello'
          })
          .mockResolvedValueOnce({ countPerPage: 11 })
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({
            query: 'hello'
          })
          .mockResolvedValueOnce({ countPerPage: 11 });

        spyOn(LINETvSearchOperation.request, 'send')
          .mockResolvedValueOnce({
            data: null
          })
          .mockResolvedValueOnce({
            data: {
              body: null
            }
          })
          .mockResolvedValueOnce({
            data: {
              body: {
                clips: null
              }
            }
          });
      });

      it('handles error', async () => {
        // Test no response data
        await expect(LINETvSearchOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('No query result'.warn);
        // Test response no data.body
        await expect(LINETvSearchOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('No query result'.warn);
        // Test no query data (data.body.clips)
        await expect(LINETvSearchOperation.run({})).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('No query result'.warn);
      });
      afterAll(() => {
        LINETvSearchOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when got query result', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            clips: [
              {
                serviceUrl: 'https://tv.line.me/v/1234567',
                clipNo: 1234567,
                clipTitle: 'Love you',
                playCount: 2571415,
                thumbnailUrl: 'https://pic.net/1234567.png',
                clipSubtitle: '',
                displayPlayTime: '22:56',
                likeitPoint: 9121
              }
            ]
          }
        }
      };
      const expectedQueryResult = mockResponse.data.body.clips.map(item => {
        const columnHeader = {};
        columnHeader['Clip Number'.success] = item.clipNo;
        columnHeader['Title'.success] = item.clipTitle;
        columnHeader['Play Count'.success] = item.playCount;
        columnHeader['Like Point'.success] = item.likeitPoint;
        return columnHeader;
      });
      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({
            countryCode: 'th'
          })
          .mockResolvedValueOnce({
            query: 'inth'
          })
          .mockResolvedValueOnce({
            countPerPage: 11
          });
        spyOn(LINETvSearchOperation.request, 'send').mockResolvedValueOnce(
          mockResponse
        );
      });
      it('handles data correctly', async () => {
        await expect(LINETvSearchOperation.run({})).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedQueryResult);
      });
      afterAll(() => {
        LINETvSearchOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('When has query data and select next page', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            clips: [
              {
                serviceUrl: 'https://tv.line.me/v/1234567',
                clipNo: 1234567,
                clipTitle: 'Love you',
                playCount: 2571415,
                thumbnailUrl: 'https://pic.net/1234567.png',
                clipSubtitle: '',
                displayPlayTime: '22:56',
                likeitPoint: 9121
              }
            ],
            hasMore: true
          }
        }
      };
      const countryCode = 'th';
      const query = 'inth';
      const countPerPage = 11;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({
            countryCode
          })
          .mockResolvedValueOnce({
            query
          })
          .mockResolvedValueOnce({
            countPerPage
          })
          .mockResolvedValueOnce({
            nextPage: true
          })
          .mockResolvedValueOnce({
            nextPage: false
          });
        spyOn(LINETvSearchOperation.request, 'send')
          .mockResolvedValueOnce(mockResponse)
          .mockResolvedValueOnce(mockResponse);
      });
      it('display next page correctly', async () => {
        await expect(LINETvSearchOperation.run({})).resolves.toEqual(true);
        expect(LINETvSearchOperation.request.send).toHaveBeenCalledWith(
          mockConfig.channel.id,
          countryCode,
          query,
          2,
          countPerPage
        );
      });
      afterAll(() => {
        LINETvSearchOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('When error on next page', () => {
      const error = new Error('Fail to get response');
      let prompts;
      const mockResponse = {
        data: {
          body: {
            clips: [
              {
                serviceUrl: 'https://tv.line.me/v/1234567',
                clipNo: 1234567,
                clipTitle: 'Love you',
                playCount: 2571415,
                thumbnailUrl: 'https://pic.net/1234567.png',
                clipSubtitle: '',
                displayPlayTime: '22:56',
                likeitPoint: 9121
              }
            ],
            hasMore: true
          }
        }
      };
      const countryCode = 'th';
      const query = 'inth';
      const countPerPage = 11;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({
            countryCode
          })
          .mockResolvedValueOnce({
            query
          })
          .mockResolvedValueOnce({
            countPerPage
          })
          .mockResolvedValueOnce({
            nextPage: true
          })
          .mockResolvedValueOnce({
            nextPage: true
          });
        spyOn(LINETvSearchOperation, 'logAxiosError').mockReturnValue();
        spyOn(LINETvSearchOperation.request, 'send')
          .mockResolvedValueOnce(mockResponse)
          .mockRejectedValueOnce(error);
      });
      it('handle error', async () => {
        await expect(LINETvSearchOperation.run({})).resolves.toEqual(false);
        expect(LINETvSearchOperation.logAxiosError).toHaveBeenCalledWith(error);
      });
      afterAll(() => {
        LINETvSearchOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });
    describe('when input options --format json', () => {
      let prompts;
      const mockResponse = {
        data: {
          body: {
            clips: [
              {
                serviceUrl: 'https://tv.line.me/v/1234567',
                clipNo: 1234567,
                clipTitle: 'Love you',
                playCount: 2571415,
                thumbnailUrl: 'https://pic.net/1234567.png',
                clipSubtitle: '',
                displayPlayTime: '22:56',
                likeitPoint: 9121
              }
            ]
          }
        }
      };
      const expectedFormatJSON = JSON.stringify(mockResponse.data, null, 2);

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({
            countryCode: 'th'
          })
          .mockResolvedValueOnce({
            query: 'inth'
          })
          .mockResolvedValueOnce({
            countPerPage: 11
          });
        spyOn(LINETvSearchOperation.request, 'send').mockResolvedValueOnce(
          mockResponse
        );
      });
      it('handles data correctly', async () => {
        await expect(
          LINETvSearchOperation.run({ format: 'json' })
        ).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(expectedFormatJSON);
      });
      afterAll(() => {
        LINETvSearchOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });
  });
});

describe('LINETvGetCategoryOperation validateNonZero', () => {
  it('handle zero correctly', () => {
    expect(LINETvSearchOperation.validateNonZero(0)).toEqual(
      'Zero is not allowed'
    );
  });
  it('handle non-zero number correctly', () => {
    expect(LINETvSearchOperation.validateNonZero(1)).toEqual(true);
  });
});

describe('LINETvGetCategoryOperation validate 2 character country code', () => {
  it('handle 2 characters correctly', () => {
    expect(LINETvSearchOperation.validateCountryCode('cc')).toEqual(true);
  });
  it('handle error correctly', () => {
    expect(LINETvSearchOperation.validateCountryCode('ccc')).toEqual(
      'Please input ISO 3166-2 (2 characters)'
    );
  });
});

describe('LINETvGetCategoryOperation validate NotEmpty', () => {
  it('handle string correctly', () => {
    expect(LINETvSearchOperation.validateNotEmpty('cc')).toEqual(true);
  });
  it('handle empty string correctly', () => {
    expect(LINETvSearchOperation.validateNotEmpty()).toEqual(
      'Query cannot empty'
    );
  });
});
