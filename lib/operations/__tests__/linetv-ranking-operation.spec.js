import 'console-table';
import LINETvRankingOperation from '../linetv-ranking-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv ranking', () => {
  it('extends Operation', () => {
    expect(LINETvRankingOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LINETvRankingOperation.usage).toEqual([
      {
        header: 'Gets clip ranking data.'.help,
        content: `linetv ranking`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvRankingOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvRankingOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LINETvRankingOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvRankingOperation.validateConfig.mockRestore();
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
      spyOn(LINETvRankingOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvRankingOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when cannot ranking clip data', () => {
      let prompts;
      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({
            countPerPage: 11
          })
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({
            countPerPage: 11
          });

        spyOn(LINETvRankingOperation.request, 'send')
          .mockResolvedValueOnce({
            data: null
          })
          .mockResolvedValueOnce({
            data: {
              body: null
            }
          });
      });

      it('handles error', async () => {
        // Test no response data
        await expect(LINETvRankingOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Ranking clips not found'.warn
        );
        // Test response no data.body
        await expect(LINETvRankingOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Ranking clips not found'.warn
        );
      });
      afterAll(() => {
        LINETvRankingOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when got ranking data', () => {
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
      const expectedRankingClip = mockResponse.data.body.clips.map(item => {
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
            countPerPage: 11
          });
        spyOn(LINETvRankingOperation.request, 'send').mockResolvedValueOnce(
          mockResponse
        );
      });
      it('handles data correctly', async () => {
        await expect(LINETvRankingOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedRankingClip);
      });
      afterAll(() => {
        LINETvRankingOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('When has category data and select next page', () => {
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
      const countPerPage = 11;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({
            countryCode
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
        spyOn(LINETvRankingOperation.request, 'send')
          .mockResolvedValueOnce(mockResponse)
          .mockResolvedValueOnce(mockResponse);
      });
      it('display next page correctly', async () => {
        await expect(LINETvRankingOperation.run()).resolves.toEqual(true);
        expect(LINETvRankingOperation.request.send).toHaveBeenCalledWith(
          mockConfig.channel.id,
          countryCode,
          2,
          countPerPage
        );
      });
      afterAll(() => {
        LINETvRankingOperation.request.send.mockRestore();
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
      const countPerPage = 11;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({
            countryCode
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
        spyOn(LINETvRankingOperation, 'logAxiosError').mockReturnValue();
        spyOn(LINETvRankingOperation.request, 'send')
          .mockResolvedValueOnce(mockResponse)
          .mockRejectedValueOnce(error);
      });
      it('handle error', async () => {
        await expect(LINETvRankingOperation.run()).resolves.toEqual(false);
        expect(LINETvRankingOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });
      afterAll(() => {
        LINETvRankingOperation.request.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });
  });
});

describe('LINETvGetCategoryOperation validateNonZero', () => {
  it('handle zero correctly', () => {
    expect(LINETvRankingOperation.validateNonZero(0)).toEqual(
      'Zero is not allowed'
    );
  });
  it('handle non-zero number correctly', () => {
    expect(LINETvRankingOperation.validateNonZero(1)).toEqual(true);
  });
});

describe('LINETvGetCategoryOperation validate 2 character country code', () => {
  it('handle 2 characters correctly', () => {
    expect(LINETvRankingOperation.validateCountryCode('cc')).toEqual(true);
  });
  it('handle error correctly', () => {
    expect(LINETvRankingOperation.validateCountryCode('ccc')).toEqual(
      'Please input ISO 3166-2 (2 characters)'
    );
  });
});
