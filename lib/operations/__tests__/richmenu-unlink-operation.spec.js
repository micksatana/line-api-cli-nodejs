import Operation from '../operation';
import RichmenuUnlinkOperation from '../richmenu-unlink-operation';

const { spyOn, mock, unmock } = jest;

describe('richmenu link', () => {
  it('extends Operation', () => {
    expect(RichmenuUnlinkOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(RichmenuUnlinkOperation.usage).toEqual([
      {
        header: 'Unlink user-specific rich menu'.help,
        content: `richmenu unlink`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof RichmenuUnlinkOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(RichmenuUnlinkOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(RichmenuUnlinkOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      RichmenuUnlinkOperation.validateConfig.mockRestore();
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
      spyOn(RichmenuUnlinkOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(RichmenuUnlinkOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      mock('prompts');
      prompts = require('prompts');
    });

    describe('prompts for user ID', () => {
      const userId = 'mock user ID';
      const userIdPrompt = {
        type: 'text',
        name: 'userId',
        message: `Unlink menu from which user ID`
      };

      beforeEach(() => {
        console.log.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            RichmenuUnlinkOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            RichmenuUnlinkOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(prompts).toHaveBeenCalledWith(
            userIdPrompt,
            RichmenuUnlinkOperation.cancelOption
          );
          expect(
            RichmenuUnlinkOperation.cancelOption.onCancel
          ).toHaveBeenCalledTimes(1);
        });

        afterAll(() => {
          RichmenuUnlinkOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and user ID is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValueOnce({ userId: '' });
          spyOn(
            RichmenuUnlinkOperation.unlinkUserRequest,
            'send'
          ).mockResolvedValue({});
        });

        it('link the rich menu to the user', async () => {
          await expect(RichmenuUnlinkOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            userIdPrompt,
            RichmenuUnlinkOperation.cancelOption
          );
          expect(
            RichmenuUnlinkOperation.unlinkUserRequest.send
          ).not.toHaveBeenCalled();
        });

        afterAll(() => {
          prompts.mockReset();
          RichmenuUnlinkOperation.unlinkUserRequest.send.mockReset();
        });
      });

      describe('and able to link the rich menu', () => {
        beforeAll(() => {
          prompts.mockResolvedValueOnce({ userId });
          spyOn(
            RichmenuUnlinkOperation.unlinkUserRequest,
            'send'
          ).mockResolvedValue({});
        });

        it('link the rich menu to the user', async () => {
          await expect(RichmenuUnlinkOperation.run()).resolves.toEqual(true);
          expect(prompts).toHaveBeenCalledWith(
            userIdPrompt,
            RichmenuUnlinkOperation.cancelOption
          );
          expect(
            RichmenuUnlinkOperation.unlinkUserRequest.send
          ).toHaveBeenCalledWith(userId);
        });

        afterAll(() => {
          prompts.mockReset();
          RichmenuUnlinkOperation.unlinkUserRequest.send.mockReset();
        });
      });

      describe('and NOT able to link the rich menu', () => {
        const error = new Error('failed to remove');

        beforeAll(() => {
          prompts.mockResolvedValueOnce({ userId });
          spyOn(
            RichmenuUnlinkOperation.unlinkUserRequest,
            'send'
          ).mockRejectedValue(error);
          spyOn(console, 'error').mockReturnValue(undefined);
        });

        it('handles error', async () => {
          await expect(RichmenuUnlinkOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            userIdPrompt,
            RichmenuUnlinkOperation.cancelOption
          );
          expect(
            RichmenuUnlinkOperation.unlinkUserRequest.send
          ).toHaveBeenCalledWith(userId);
        });

        afterAll(() => {
          console.error.mockRestore();
          prompts.mockReset();
          RichmenuUnlinkOperation.unlinkUserRequest.send.mockReset();
        });
      });
    });

    afterAll(() => {
      RichmenuUnlinkOperation.config.mockRestore();
      RichmenuUnlinkOperation.validateConfig.mockRestore();
      console.log.mockRestore();
      prompts.mockRestore();
      unmock('prompts');
    });
  });
});
