import { AxiosResponse } from 'axios';
import Operation from '../operation';
import RichmenuAddOperation from '../richmenu-add-operation';

const { spyOn, mock, unmock } = jest;

describe('richmenu add', () => {
  it('extends Operation', () => {
    expect(RichmenuAddOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(RichmenuAddOperation.usage).toEqual([
      {
        header: 'Add a rich menu'.help,
        content: `richmenu add`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof RichmenuAddOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(RichmenuAddOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(RichmenuAddOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      RichmenuAddOperation.validateConfig.mockRestore();
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
      spyOn(RichmenuAddOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(RichmenuAddOperation, 'validateConfig').mockReturnValue(true);
    });

    describe('and user cancel', () => {
      
    });

    describe('and all questions answered', () => {
      it('handles correctly', async () => {
        await expect(RichmenuAddOperation.run()).resolves.toEqual(true);
      });
    });

    afterAll(() => {
      RichmenuAddOperation.config.mockRestore();
      RichmenuAddOperation.validateConfig.mockRestore();
    });
  });
});
