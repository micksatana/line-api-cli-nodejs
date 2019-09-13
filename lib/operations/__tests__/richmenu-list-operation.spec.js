import 'console-table';

import Operation from '../operation';
import RichmenuListOperation from '../richmenu-list-operation';

const { spyOn } = jest;

describe('richmenu list', () => {
  it('extends Operation', () => {
    expect(RichmenuListOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(RichmenuListOperation.usage).toEqual([
      {
        header: 'List rich menus'.help,
        content: `richmenu list`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof RichmenuListOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(RichmenuListOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(RichmenuListOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      RichmenuListOperation.validateConfig.mockRestore();
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
      spyOn(RichmenuListOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(RichmenuListOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list rich menus', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(RichmenuListOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(RichmenuListOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        RichmenuListOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no rich menu data', () => {
      const mockResponse = {
        data: {
          richmenus: []
        }
      };

      beforeAll(() => {
        spyOn(RichmenuListOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
      });

      it('handles error', async () => {
        await expect(RichmenuListOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
      });

      afterAll(() => {
        RichmenuListOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has rich menus', () => {
      const mockResponse = {
        data: {
          richmenus: [
            {
              richMenuId: 'xxxx',
              name: 'TestMenu',
              size: { width: 1111, height: 1111 },
              chatBarText: 'TestMenu',
              selected: false,
              areas: []
            }
          ]
        }
      };
      const expectedRow = {};

      beforeAll(() => {
        spyOn(RichmenuListOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        expectedRow['Rich menu ID'.success] = mockResponse.data.richmenus[0].richMenuId;
        expectedRow['Size'.success] = `${mockResponse.data.richmenus[0].size.width}x${mockResponse.data.richmenus[0].size.height}`;
        expectedRow['Bar text'.success] = mockResponse.data.richmenus[0].chatBarText;
        expectedRow['Selected'.success] = mockResponse.data.richmenus[0].selected;
        expectedRow['No. of Areas'.success] = mockResponse.data.richmenus[0].areas.length;
      });

      it('handles error', async () => {
        await expect(RichmenuListOperation.run()).resolves.toEqual(true);
        expect(console.table).toHaveBeenCalledWith([expectedRow])
      });

      afterAll(() => {
        RichmenuListOperation.listRequest.send.mockRestore();
      });
    });

    afterAll(() => {
      RichmenuListOperation.config.mockRestore();
      RichmenuListOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
