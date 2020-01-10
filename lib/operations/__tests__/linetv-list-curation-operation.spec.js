import 'console-table';

import LINETvListCurationOperation from '../linetv-list-curation-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:curation', () => {
  it('extends Operation', () => {
    expect(LINETvListCurationOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvListCurationOperation.usage).toEqual([
      {
        header: 'List curation module types'.help,
        content: `linetv list:curation`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvListCurationOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvListCurationOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(LINETvListCurationOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvListCurationOperation.validateConfig.mockRestore();
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
      spyOn(LINETvListCurationOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvListCurationOperation, 'validateConfig').mockReturnValue(
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
        spyOn(LINETvListCurationOperation.request, 'send').mockRejectedValue(
          error
        );
        spyOn(LINETvListCurationOperation, 'logAxiosError').mockReturnValue(
          undefined
        );
      });

      it('handles error', async () => {
        await expect(LINETvListCurationOperation.run()).resolves.toEqual(false);
        expect(LINETvListCurationOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvListCurationOperation.request.send.mockRestore();
        console.error.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when no curation data', () => {
      beforeEach(() => {
        console.log.mockClear();
      });

      it('handles undefined', async () => {
        spyOn(LINETvListCurationOperation.request, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(LINETvListCurationOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Curation module not found'.info
        );
      });

      afterAll(() => {
        LINETvListCurationOperation.request.send.mockRestore();
      });
    });

    describe('when has culation module', () => {
      const mockResponse = {
        data: {
          body: {
            supportModule: [
              {
                dataModel: 'clip',
                name: 'represent_clip'
              },
              {
                dataModel: 'clip',
                name: 'editor_pick_clip'
              },
              {
                dataModel: 'clip',
                name: 'hot_clip'
              },
              {
                dataModel: 'clip',
                name: 'theme_clip'
              },
              {
                dataModel: 'playlist',
                name: 'theme_playlist'
              },
              {
                dataModel: 'channel',
                name: 'hot_channel'
              },
              {
                dataModel: 'clip',
                name: 'special_clip'
              }
            ]
          }
        }
      };
      const expectedSupportModule = mockResponse.data.body.supportModule.map(item => {
        const columnHeader = {};
        columnHeader['Name'.success] = item.name;
        columnHeader['Data Model'.success] = item.dataModel;
        return columnHeader;
      });

      beforeAll(() => {
        spyOn(LINETvListCurationOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display table correctly', async () => {
        await expect(LINETvListCurationOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedSupportModule);
      });

      afterAll(() => {
        LINETvListCurationOperation.request.send.mockRestore();
      });
    });

    afterAll(() => {
      LINETvListCurationOperation.config.mockRestore();
      LINETvListCurationOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
