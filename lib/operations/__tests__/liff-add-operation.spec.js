import Operation from '../operation';
import LIFFAddOperation from '../liff-add-operation';

const { spyOn, mock, unmock } = jest;

describe('liff add', () => {
  it('extends Operation', () => {
    expect(LIFFAddOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LIFFAddOperation.usage).toEqual([
      {
        header: 'Add a LIFF view'.help,
        content: `liff add`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LIFFAddOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LIFFAddOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LIFFAddOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LIFFAddOperation.validateConfig.mockRestore();
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
    let prompts;

    beforeAll(() => {
      spyOn(LIFFAddOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LIFFAddOperation, 'validateConfig').mockReturnValue(true);
      mock('prompts');
      prompts = require('prompts');
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    describe('prompts for view type', () => {
      const viewTypePrompt = {
        type: 'text',
        name: 'viewType',
        message: 'Select view type',
        choices: [
          {
            title: 'compact',
            description: '50% of device screen height',
            value: 'compact'
          },
          {
            title: 'tall',
            description: '80% of device screen height',
            value: 'tall'
          },
          {
            title: 'full',
            description: '100% of device screen height',
            value: 'full'
          }
        ]
      };

      xit('', () => {});
    });

    afterAll(() => {
      LIFFAddOperation.config.mockRestore();
      LIFFAddOperation.validateConfig.mockRestore();
      console.log.mockRestore();
      prompts.mockRestore();
      unmock('prompts');
    });
  });
});
