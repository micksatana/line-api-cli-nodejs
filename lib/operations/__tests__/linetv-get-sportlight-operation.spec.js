import 'console-table';

import LINETvListModuleOperation from '../linetv-list-modules-operation';
import LINETvGetSpotlightOperation from '../linetv-get-sportlight-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:modules', () => {
  it('extends Operation', () => {
    expect(LINETvGetSpotlightOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvGetSpotlightOperation.usage).toEqual([
      {
        header: 'Gets spotlight data'.help,
        content: `linetv get:spotlight`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvGetSpotlightOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvGetSpotlightOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvGetSpotlightOperation.validateConfig.mockRestore();
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
      spyOn(LINETvGetSpotlightOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvGetSpotlightOperation, 'validateConfig').mockReturnValue(
        true
      );
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list module', () => {
      const error = new Error('list failed');
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(
          LINETvGetSpotlightOperation.listRequest,
          'send'
        ).mockRejectedValue(error);
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        LINETvGetSpotlightOperation.request.send.mockRestore();
        console.error.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when module not found', () => {
      let prompts;
      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvGetSpotlightOperation.listRequest, 'send')
          .mockResolvedValueOnce({
            data: {
              body: {
                supportModule: []
              }
            }
          })
          .mockResolvedValueOnce({
            data: {
              body: {}
            }
          });
      });

      it('handles error', async () => {
        // Test empty supportModule
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Modules not found'.info);
        console.log.mockClear();
        // Test no supportModules
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Modules not found'.info);
      });
      afterAll(() => {
        LINETvGetSpotlightOperation.listRequest.send.mockRestore();
      });
    });

    describe('when user select clip dataModel', () => {
      let prompts;
      const mockListResponse = {
        data: {
          body: {
            supportModule: [
              {
                dataModel: 'clip',
                name: 'clipxxx'
              }
            ]
          }
        }
      };
      const mockGetResponse = {
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
              },
              {
                serviceUrl: 'https://tv.line.me/v/2345678',
                clipNo: 2345678,
                clipTitle: 'Love you 2',
                playCount: 3162077,
                thumbnailUrl: 'https://pic.net/2345678.jpg',
                clipSubtitle: '',
                displayPlayTime: '16:42',
                likeitPoint: 2185
              }
            ]
          }
        }
      };
      const expectedSportlightClip = mockGetResponse.data.body.clips.map(
        item => {
          const columnHeader = {};
          columnHeader['Clip Number'.success] = item.clipNo;
          columnHeader['Title'.success] = item.clipTitle;
          columnHeader['Play Count'.success] = item.playCount;
          columnHeader['Like Point'.success] = item.likeitPoint;
          return columnHeader;
        }
      );

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValue({
          countryCode: 'th',
          moduleName: { name: 'clip', dataModel: 'clip' }
        });
        spyOn(
          LINETvGetSpotlightOperation.listRequest,
          'send'
        ).mockResolvedValue(mockListResponse);
        spyOn(LINETvGetSpotlightOperation.getRequest, 'send')
          .mockResolvedValueOnce(mockGetResponse)
          .mockResolvedValueOnce({
            data: {
              body: null
            }
          });
      });

      it('display table correctly', async () => {
        // When got data
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedSportlightClip);
        // When no data
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Data not found'.warn);
      });

      afterAll(() => {
        LINETvGetSpotlightOperation.listRequest.send.mockRestore();
        LINETvGetSpotlightOperation.getRequest.send.mockResotore();
        prompts.mockRestore();
      });
    });

    describe('when user select channel dataModel', () => {
      let prompts;
      const mockListResponse = {
        data: {
          body: {
            supportModule: [
              {
                dataModel: 'channel',
                name: 'channelxxx'
              }
            ]
          }
        }
      };
      const mockGetResponse = {
        data: {
          body: {
            channels: [
              {
                channelId: 'one',
                thumbnailUrl: 'https://pic.net/12345.png',
                channelName: 'one-one',
                channelEmblem: '',
                serviceUrl: 'https://tv.line.me/fafakrak',
                badgeType: 'NEW'
              },
              {
                channelId: 'two',
                thumbnailUrl: 'https://pic.net/23456.png',
                channelName: 'one-two',
                channelEmblem: '',
                serviceUrl: 'https://tv.line.me/fafakrak',
                badgeType: 'NEW'
              }
            ]
          }
        }
      };
      const expectedSportlightChannel = mockGetResponse.data.body.channels.map(
        item => {
          const columnHeader = {};
          columnHeader['Channel ID'.success] = item.channelId;
          columnHeader['Channel Name'.success] = item.channelName;
          columnHeader['URL'.success] = item.serviceUrl;
          return columnHeader;
        }
      );

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValue({
          countryCode: 'th',
          moduleName: { name: 'clip', dataModel: 'channel' }
        });
        spyOn(
          LINETvGetSpotlightOperation.listRequest,
          'send'
        ).mockResolvedValue(mockListResponse);
        spyOn(LINETvGetSpotlightOperation.getRequest, 'send')
          .mockResolvedValueOnce(mockGetResponse)
          .mockResolvedValueOnce({
            data: {
              body: null
            }
          });
      });

      it('display table correctly', async () => {
        // When got data
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedSportlightChannel);
        // When no data
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Data not found'.warn);
      });

      afterAll(() => {
        LINETvGetSpotlightOperation.listRequest.send.mockRestore();
        LINETvGetSpotlightOperation.getRequest.send.mockResotore();
        prompts.mockRestore();
      });
    });

    describe('when user select playlist dataModel', () => {
      let prompts;
      const mockListResponse = {
        data: {
          body: {
            supportModule: [
              {
                dataModel: 'playlist',
                name: 'playlistxxx'
              }
            ]
          }
        }
      };
      const mockGetResponse = {
        data: {
          body: {
            playlists: [
              {
                title: 'Playlist Title-XXX',
                subtitle: 'Playlist sub',
                playlists: [
                  {
                    clipCount: 5,
                    serviceUrl: 'https://tv.line.me/v/123/list/234',
                    playlistNo: 123456,
                    thumbnailUrl: 'https://pic.net/1234',
                    playlistTitle: 'best title xxx'
                  },
                  {
                    clipCount: 5,
                    serviceUrl: 'https://tv.line.me/v/234/list/456',
                    playlistNo: 234567,
                    thumbnailUrl: 'https://pic.net/2345',
                    playlistTitle: 'best comedy xxx'
                  }
                ]
              }
            ]
          }
        }
      };
      const expectedSportlightPlaylist = JSON.stringify(
        mockGetResponse.data.body.playlists,
        null,
        2
      );

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValue({
          countryCode: 'th',
          moduleName: { name: 'playlistxxx', dataModel: 'playlist' }
        });
        spyOn(
          LINETvGetSpotlightOperation.listRequest,
          'send'
        ).mockResolvedValue(mockListResponse);
        spyOn(LINETvGetSpotlightOperation.getRequest, 'send')
          .mockResolvedValueOnce(mockGetResponse)
          .mockResolvedValueOnce({
            data: {
              body: null
            }
          });
      });

      it('display data correctly', async () => {
        // When got data
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(expectedSportlightPlaylist);
        // When no data
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Data not found'.warn);
      });

      afterAll(() => {
        LINETvGetSpotlightOperation.listRequest.send.mockRestore();
        LINETvGetSpotlightOperation.getRequest.send.mockResotore();
        prompts.mockRestore();
      });
    });

    describe('when user select invalid dataModel', () => {
      let prompts;
      const mockListResponse = {
        data: {
          body: {
            supportModule: [
              {
                dataModel: 'xxx',
                name: 'playlistxxx'
              }
            ]
          }
        }
      };
      const mockGetResponse = {
        data: {
          body: {
            xxxx: [
              {
                xxxx: 'one'
              },
              {
                yyyy: 'two'
              }
            ]
          }
        }
      };
      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValue({
          countryCode: 'th',
          moduleName: { name: 'playlistxxx', dataModel: 'xxx' }
        });
        spyOn(
          LINETvGetSpotlightOperation.listRequest,
          'send'
        ).mockResolvedValue(mockListResponse);
        spyOn(
          LINETvGetSpotlightOperation.getRequest,
          'send'
        ).mockResolvedValue(mockGetResponse);
      });
      it('display error', async () => {
        await expect(LINETvGetSpotlightOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(
          'Data model not implemented'
        );
      });

      afterAll(() => {
        LINETvGetSpotlightOperation.listRequest.send.mockRestore();
        LINETvGetSpotlightOperation.getRequest.send.mockResotore();
        prompts.mockRestore();
      });
    });

    afterAll(() => {
      LINETvGetSpotlightOperation.config.mockRestore();
      LINETvGetSpotlightOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
