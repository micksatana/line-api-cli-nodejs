import 'console-table';

import LINETvListCategoryOperation from '../linetv-list-category-operation';
import Operation from '../operation';

const { spyOn, mock, unmock } = jest;

describe('linetv list:category', () => {
  it('extends Operation', () => {
    expect(LINETvListCategoryOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(LINETvListCategoryOperation.usage).toEqual([
      {
        header: `Gets a category list such as drama, music, etc.`.help,
        content: `linetv list:category`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETvListCategoryOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LINETvListCategoryOperation, 'validateConfig').mockReturnValue(
        false
      );
    });

    it('handles correctly', async () => {
      await expect(LINETvListCategoryOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LINETvListCategoryOperation.validateConfig.mockRestore();
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
      spyOn(LINETvListCategoryOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(LINETvListCategoryOperation, 'validateConfig').mockReturnValue(
        true
      );
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list cagegory', () => {
      const error = new Error('Category list not found');
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
        prompts.mockResolvedValueOnce({ countryCode: 'th' });
        spyOn(LINETvListCategoryOperation.request, 'send').mockRejectedValue(
          error
        );
        spyOn(LINETvListCategoryOperation, 'logAxiosError').mockReturnValue(
          undefined
        );
      });

      it('handles error', async () => {
        await expect(LINETvListCategoryOperation.run()).resolves.toEqual(false);
        expect(LINETvListCategoryOperation.logAxiosError).toHaveBeenCalledWith(
          error
        );
      });

      afterAll(() => {
        LINETvListCategoryOperation.request.send.mockRestore();
        console.error.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    describe('when no category list', () => {
      beforeEach(() => {
        console.log.mockClear();
      });

      it('handles undefined', async () => {
        spyOn(LINETvListCategoryOperation.request, 'send').mockResolvedValue({
          data: undefined
        });
        await expect(LINETvListCategoryOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith(
          'Category list not found'.info
        );
      });

      afterAll(() => {
        LINETvListCategoryOperation.request.send.mockRestore();
      });
    });

    describe('when has category list', () => {
      const mockResponse = {
        data: {
          body: {
            tabs: [
              {
                categoryName: 'ละคร',
                categoryCode: 'DRAMA',
                categoryEnName: 'DRAMA',
                serviceUrl: 'https://tv.line.me/c/drama'
              },
              {
                categoryName: 'บันเทิง',
                categoryCode: 'ENTERTAINMENT',
                categoryEnName: 'ENTERTAINMENT',
                serviceUrl: 'https://tv.line.me/c/entertainment'
              }
            ]
          }
        }
      };
      const expectedSupportModule = mockResponse.data.body.tabs.map(item => {
        const columnHeader = {};
        columnHeader['Category'.success] = item.categoryName;
        columnHeader['Category Code'.success] = item.categoryCode;
        columnHeader['URL'.success] = item.serviceUrl;
        return columnHeader;
      });

      beforeAll(() => {
        spyOn(LINETvListCategoryOperation.request, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('display table correctly', async () => {
        await expect(LINETvListCategoryOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith(expectedSupportModule);
      });

      afterAll(() => {
        LINETvListCategoryOperation.request.send.mockRestore();
      });
    });

    afterAll(() => {
      LINETvListCategoryOperation.config.mockRestore();
      LINETvListCategoryOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
