import Operation from '../operation';
import RichmenuSetDefaultOperation from '../richmenu-set-default-operation';

const { spyOn, mock, unmock } = jest;

describe('richmenu default', () => {
  it('extends Operation', () => {
    expect(RichmenuSetDefaultOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(RichmenuSetDefaultOperation.usage).toEqual([
      {
        header: 'Set a rich menu as default for all users'.help,
        content: `richmenu default`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof RichmenuSetDefaultOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(RichmenuSetDefaultOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(RichmenuSetDefaultOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      RichmenuSetDefaultOperation.validateConfig.mockRestore();
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
      spyOn(RichmenuSetDefaultOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(RichmenuSetDefaultOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
    });

    describe('when failed to list rich menus', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(RichmenuSetDefaultOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(RichmenuSetDefaultOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        RichmenuSetDefaultOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no rich menu data', () => {
      beforeAll(() => {
        spyOn(RichmenuSetDefaultOperation.listRequest, 'send')
          .mockResolvedValueOnce({
            data: {
              richmenus: []
            }
          })
          .mockResolvedValueOnce({
            data: {}
          });
      });

      it('handles error', async () => {
        // Test empty richmenus
        await expect(RichmenuSetDefaultOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
        console.log.mockClear();
        // Test no richmenus
        await expect(RichmenuSetDefaultOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
      });

      afterAll(() => {
        RichmenuSetDefaultOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has rich menus', () => {
      const richMenuId = 'xxxx';
      const mockResponse = {
        data: {
          richmenus: [
            {
              richMenuId,
              name: 'TestMenu',
              size: { width: 1111, height: 1111 },
              chatBarText: 'TestMenu',
              selected: false,
              areas: []
            }
          ]
        }
      };
      const richMenusPrompt = {
        type: 'select',
        name: 'richMenuId',
        message: 'Select a rich menu as default for all users',
        choices: [
          {
            title: `${mockResponse.data.richmenus[0].name} [${mockResponse.data.richmenus[0].richMenuId}]`,
            description: `${mockResponse.data.richmenus[0].chatBarText} has ${mockResponse.data.richmenus[0].areas.length} areas`,
            value: mockResponse.data.richmenus[0].richMenuId
          }
        ]
      };

      beforeAll(() => {
        spyOn(RichmenuSetDefaultOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(RichmenuSetDefaultOperation.setDefaultRequest, 'send').mockResolvedValue(
          {}
        );
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        RichmenuSetDefaultOperation.listRequest.send.mockClear();
        RichmenuSetDefaultOperation.setDefaultRequest.send.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            RichmenuSetDefaultOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            RichmenuSetDefaultOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(RichmenuSetDefaultOperation.listRequest.send).toHaveBeenCalled();
          expect(
            RichmenuSetDefaultOperation.setDefaultRequest.send
          ).not.toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            richMenusPrompt,
            RichmenuSetDefaultOperation.cancelOption
          );
          expect(
            RichmenuSetDefaultOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          RichmenuSetDefaultOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and user choose a rich menu', () => {
        describe('and able to set the rich menu as default', () => {
          beforeAll(() => {
            prompts.mockResolvedValueOnce({ richMenuId });
            spyOn(
              RichmenuSetDefaultOperation.setDefaultRequest,
              'send'
            ).mockResolvedValue({});
          });

          it('set the rich menu as default', async () => {
            await expect(RichmenuSetDefaultOperation.run()).resolves.toEqual(true);
            expect(RichmenuSetDefaultOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              richMenusPrompt,
              RichmenuSetDefaultOperation.cancelOption
            );
            expect(
              RichmenuSetDefaultOperation.setDefaultRequest.send
            ).toHaveBeenCalledWith(richMenuId);
          });

          afterAll(() => {
            prompts.mockReset();
            RichmenuSetDefaultOperation.setDefaultRequest.send.mockReset();
          });
        });

        describe('and NOT able to set the rich menu as default', () => {
          const error = new Error('failed to remove');

          beforeAll(() => {
            prompts.mockResolvedValueOnce({ richMenuId });
            spyOn(
              RichmenuSetDefaultOperation.setDefaultRequest,
              'send'
            ).mockRejectedValue(error);
            spyOn(console, 'error').mockReturnValue(undefined);
          });

          it('handles error', async () => {
            await expect(RichmenuSetDefaultOperation.run()).resolves.toEqual(false);
            expect(RichmenuSetDefaultOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              richMenusPrompt,
              RichmenuSetDefaultOperation.cancelOption
            );
            expect(
              RichmenuSetDefaultOperation.setDefaultRequest.send
            ).toHaveBeenCalledWith(richMenuId);
          });

          afterAll(() => {
            console.error.mockRestore();
            prompts.mockReset();
            RichmenuSetDefaultOperation.setDefaultRequest.send.mockReset();
          });
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      afterAll(() => {
        RichmenuSetDefaultOperation.setDefaultRequest.send.mockRestore();
        RichmenuSetDefaultOperation.listRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      RichmenuSetDefaultOperation.config.mockRestore();
      RichmenuSetDefaultOperation.validateConfig.mockRestore();
      console.log.mockRestore();
    });
  });
});
