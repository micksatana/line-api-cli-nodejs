import 'console-table';

import LINETvListModulesOperation from '../linetv-list-modules-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:modules', () => {
  it('extends Operation', () => {
    expect(LINETvListModulesOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvListModulesOperation.usage).toEqual([
      {
        header: 'List curation module types'.help,
        content: `linetv list:modules`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvListModulesOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvListModulesOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(LINETvListModulesOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvListModulesOperation.validateConfig.mockRestore();
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
      spyOn(LINETvListModulesOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvListModulesOperation, 'validateConfig').mockReturnValue(true);
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
        spyOn(LINETvListModulesOperation.request, 'send').mockRejectedValue(
          error
        );
        spyOn(LINETvListModulesOperation, 'logAxiosError').mockReturnValue(
          undefined
        );
      });

      it('handles error', async () => {
        await expect(LINETvListModulesOperation.run()).resolves.toEqual(false);
        expect(LINETvListModulesOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvListModulesOperation.request.send.mockRestore();
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
        spyOn(LINETvListModulesOperation.request, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(LINETvListModulesOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Curation module not found'.info
        );
      });

      afterAll(() => {
        LINETvListModulesOperation.request.send.mockRestore();
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
      const expectedSupportModule = mockResponse.data.body.supportModule.map(
        item => {
          const columnHeader = {};
          columnHeader['Name'.success] = item.name;
          columnHeader['Data Model'.success] = item.dataModel;
          return columnHeader;
        }
      );

      beforeAll(() => {
        spyOn(LINETvListModulesOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display table correctly', async () => {
        await expect(LINETvListModulesOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedSupportModule);
      });

      afterAll(() => {
        LINETvListModulesOperation.request.send.mockRestore();
      });
    });

    afterAll(() => {
      LINETvListModulesOperation.config.mockRestore();
      LINETvListModulesOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});

describe('LINETvGetCategoryOperation validate 2 character country code', () => {
  it('handle 2 characters correctly', () => {
    expect(LINETvListModulesOperation.validateCountryCode('cc')).toEqual(true);
  });
  it('handle error correctly', () => {
    expect(LINETvListModulesOperation.validateCountryCode('ccc')).toEqual(
      'Please input ISO 3166-2 (2 characters)'
    );
  });
});
