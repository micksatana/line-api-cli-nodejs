import 'console-table';
import { EOL } from 'os';
import LINETvGetStationOperation from '../linetv-get-station-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:modules', () => {
  it('extends Operation', () => {
    expect(LINETvGetStationOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvGetStationOperation.usage).toEqual([
      {
        header: 'Gets the Station Home (TV Station) data'.help,
        content:
          `To display station data in table` +
          EOL +
          EOL +
          `linetv get:station`.code +
          EOL +
          EOL +
          `To get station data in JSON format, you can run with --format option.` +
          EOL +
          EOL +
          `linetv get:station --format json`.code +
          EOL +
          EOL +
          `To get station data start from selected page, you can run with --page option.` +
          EOL +
          EOL +
          `linetv get:station --page <number>`.code
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
    expect(typeof LINETvGetStationOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvGetStationOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LINETvGetStationOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvGetStationOperation.validateConfig.mockRestore();
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
      spyOn(LINETvGetStationOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvGetStationOperation, 'validateConfig').mockReturnValue(true);
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
          .mockResolvedValueOnce({ countryCode: 'th' })
          .mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvGetStationOperation.listRequest, 'send')
          .mockResolvedValueOnce({ data: null })
          .mockResolvedValueOnce({ data: { body: null } })
          .mockResolvedValueOnce({ data: { body: { stations: [] } } })
          .mockRejectedValueOnce(error);
        spyOn(LINETvGetStationOperation, 'logAxiosError').mockRejectedValue(
          undefined
        );
      });

      it('handles error', async () => {
        // When got no data
        await expect(LINETvGetStationOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Station data not found'.warn);
        // When got empty body
        await expect(LINETvGetStationOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Station data not found'.warn);
        // When got no stations
        await expect(LINETvGetStationOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('No Stations Home Data'.warn);
        // When got error
        await expect(LINETvGetStationOperation.run()).resolves.toEqual(false);
        expect(LINETvGetStationOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvGetStationOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when has station home (TV Station) list', () => {
      let prompts;
      const mockListResponse = {
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

      const mockGetResponse = {
        data: {
          body: {
            popularClip: {
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
            },
            popularChannel: {
              channels: [
                {
                  channelId: 'ch-one',
                  thumbnailUrl: 'https://pic.net/123.png',
                  channelName: 'channelOne',
                  channelEmblem: 'https://pic.net/234.png',
                  badgeType: null,
                  serviceUrl: 'https://tv.line.me/one'
                }
              ]
            }
          }
        }
      };
      const expectedClip = mockGetResponse.data.body.popularClip.clips.map(
        item => {
          const columnHeader = {};
          columnHeader['Clip Number'.success] = item.clipNo;
          columnHeader['Title'.success] = item.clipTitle;
          columnHeader['Play Count'.success] = item.playCount;
          columnHeader['Like Point'.success] = item.likeitPoint;
          columnHeader['URL'.success] = item.serviceUrl;
          return columnHeader;
        }
      );
      const expectedChannel = mockGetResponse.data.body.popularChannel.channels.map(
        item => {
          const columnHeader = {};
          columnHeader['Channel ID'.success] = item.channelId;
          columnHeader['Channel Name'.success] = item.channelName;
          columnHeader['Badge'.success] = item.badgeType;
          columnHeader['URL'.success] = item.serviceUrl;
          return columnHeader;
        }
      );
      const countryCode = 'th';
      const selectedStation = {
        stationId: 'cartoonclub',
        stationName: 'CARTOON CLUB'
      };

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode })
          .mockResolvedValueOnce({ selectedStation });
        spyOn(LINETvGetStationOperation.listRequest, 'send').mockResolvedValue(
          mockListResponse
        );
        spyOn(
          LINETvGetStationOperation.getRequest,
          'send'
        ).mockResolvedValueOnce(mockGetResponse);
      });

      it('display table correctly', async () => {
        await expect(LINETvGetStationOperation.run({})).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedClip);
        expect(console.table).toHaveBeenCalledWith(expectedChannel);
      });

      afterAll(() => {
        LINETvGetStationOperation.listRequest.send.mockRestore();
        LINETvGetStationOperation.getRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when has station home (TV Station) list and select next page', () => {
      let prompts;
      const mockListResponse = {
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

      const mockGetResponse = {
        data: {
          body: {
            popularClip: {
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
            },
            popularChannel: {
              channels: [
                {
                  channelId: 'ch-one',
                  thumbnailUrl: 'https://pic.net/123.png',
                  channelName: 'channelOne',
                  channelEmblem: 'https://pic.net/234.png',
                  badgeType: null,
                  serviceUrl: 'https://tv.line.me/one'
                }
              ],
              hasMore: true
            }
          }
        }
      };
      const countryCode = 'th';
      const selectedStation = {
        stationId: 'cartoonclub',
        stationName: 'CARTOON CLUB'
      };

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode })
          .mockResolvedValueOnce({ selectedStation })
          .mockResolvedValueOnce({ nextPage: true })
          .mockResolvedValueOnce({ nextPage: false });
        spyOn(LINETvGetStationOperation.listRequest, 'send').mockResolvedValue(
          mockListResponse
        );
        spyOn(LINETvGetStationOperation.getRequest, 'send')
          .mockResolvedValueOnce(mockGetResponse)
          .mockResolvedValueOnce(mockGetResponse);
      });

      it('display next page correctly', async () => {
        await expect(LINETvGetStationOperation.run({})).resolves.toEqual(true);
        expect(LINETvGetStationOperation.getRequest.send).toHaveBeenCalledWith(
          mockConfig.channel.id,
          countryCode,
          selectedStation.stationId,
          2
        );
      });

      afterAll(() => {
        LINETvGetStationOperation.listRequest.send.mockRestore();
        LINETvGetStationOperation.getRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when has station list and error on next page', () => {
      let prompts;
      const error = new Error('Cannot get response');
      const mockListResponse = {
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

      const mockGetResponse = {
        data: {
          body: {
            popularClip: {
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
            },
            popularChannel: {
              channels: [
                {
                  channelId: 'ch-one',
                  thumbnailUrl: 'https://pic.net/123.png',
                  channelName: 'channelOne',
                  channelEmblem: 'https://pic.net/234.png',
                  badgeType: null,
                  serviceUrl: 'https://tv.line.me/one'
                }
              ],
              hasMore: true
            }
          }
        }
      };
      const countryCode = 'th';
      const selectedStation = {
        stationId: 'cartoonclub',
        stationName: 'CARTOON CLUB'
      };

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode })
          .mockResolvedValueOnce({ selectedStation })
          .mockResolvedValueOnce({ nextPage: true })
          .mockResolvedValueOnce({ nextPage: true });
        spyOn(LINETvGetStationOperation.listRequest, 'send').mockResolvedValue(
          mockListResponse
        );
        spyOn(LINETvGetStationOperation.getRequest, 'send')
          .mockResolvedValueOnce(mockGetResponse)
          .mockResolvedValueOnce(mockGetResponse)
          .mockRejectedValueOnce(error);
      });

      it('handle error', async () => {
        await expect(LINETvGetStationOperation.run({})).resolves.toEqual(false);
        expect(LINETvGetStationOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvGetStationOperation.listRequest.send.mockRestore();
        LINETvGetStationOperation.getRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when put option --format json', () => {
      let prompts;
      const mockListResponse = {
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

      const mockGetResponse = {
        data: {
          body: {
            popularClip: {
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
            },
            popularChannel: {
              channels: [
                {
                  channelId: 'ch-one',
                  thumbnailUrl: 'https://pic.net/123.png',
                  channelName: 'channelOne',
                  channelEmblem: 'https://pic.net/234.png',
                  badgeType: null,
                  serviceUrl: 'https://tv.line.me/one'
                }
              ],
              hasMore: true
            }
          }
        }
      };

      const expectedFormatJSON = JSON.stringify(mockGetResponse.data, null, 2);

      const countryCode = 'th';
      const selectedStation = {
        stationId: 'cartoonclub',
        stationName: 'CARTOON CLUB'
      };

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts
          .mockResolvedValueOnce({ countryCode })
          .mockResolvedValueOnce({ selectedStation });
        spyOn(LINETvGetStationOperation.listRequest, 'send').mockResolvedValue(
          mockListResponse
        );
        spyOn(
          LINETvGetStationOperation.getRequest,
          'send'
        ).mockResolvedValueOnce(mockGetResponse);
      });

      it('display data correctly', async () => {
        await expect(
          LINETvGetStationOperation.run({ format: 'json' })
        ).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(expectedFormatJSON);
      });

      afterAll(() => {
        LINETvGetStationOperation.listRequest.send.mockRestore();
        LINETvGetStationOperation.getRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      LINETvGetStationOperation.config.mockRestore();
      LINETvGetStationOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});

describe('LINETvGetCategoryOperation validate 2 character country code', () => {
  it('handle 2 characters correctly', () => {
    expect(LINETvGetStationOperation.validateCountryCode('cc')).toEqual(true);
  });
  it('handle error correctly', () => {
    expect(LINETvGetStationOperation.validateCountryCode('ccc')).toEqual(
      'Please input ISO 3166-2 (2 characters)'
    );
  });
});
