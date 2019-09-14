import Operation from '../operation';
import RichmenuLinkOperation from '../richmenu-link-operation';

const { spyOn, mock, unmock } = jest;

describe('richmenu link', () => {
  it('extends Operation', () => {
    expect(RichmenuLinkOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(RichmenuLinkOperation.usage).toEqual([
      {
        header: 'Link a rich menu to a user'.help,
        content: `richmenu link`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof RichmenuLinkOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(RichmenuLinkOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(RichmenuLinkOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      RichmenuLinkOperation.validateConfig.mockRestore();
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
      spyOn(RichmenuLinkOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(RichmenuLinkOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
    });

    describe('when failed to list rich menus', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(RichmenuLinkOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(RichmenuLinkOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        RichmenuLinkOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no rich menu data', () => {
      beforeAll(() => {
        spyOn(RichmenuLinkOperation.listRequest, 'send')
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
        await expect(RichmenuLinkOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
        console.log.mockClear();
        // Test no richmenus
        await expect(RichmenuLinkOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
      });

      afterAll(() => {
        RichmenuLinkOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has rich menus', () => {
      const richMenu = {
        richMenuId: 'xxxx',
        name: 'TestMenu',
        size: { width: 1111, height: 1111 },
        chatBarText: 'TestMenu',
        selected: false,
        areas: []
      };
      const mockResponse = {
        data: {
          richmenus: [richMenu]
        }
      };
      const richMenusPrompt = {
        type: 'select',
        name: 'richMenu',
        message: 'Select a rich menu for a user',
        choices: [
          {
            title: `${richMenu.name} [${richMenu.richMenuId}]`,
            description: `${richMenu.chatBarText} has ${richMenu.areas.length} areas`,
            value: richMenu
          }
        ]
      };
      const userId = 'yyyyy';

      beforeAll(() => {
        spyOn(RichmenuLinkOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(RichmenuLinkOperation.linkUserRequest, 'send').mockResolvedValue(
          {}
        );
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        RichmenuLinkOperation.listRequest.send.mockClear();
        RichmenuLinkOperation.linkUserRequest.send.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            RichmenuLinkOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            RichmenuLinkOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(RichmenuLinkOperation.listRequest.send).toHaveBeenCalled();
          expect(
            RichmenuLinkOperation.linkUserRequest.send
          ).not.toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            richMenusPrompt,
            RichmenuLinkOperation.cancelOption
          );
          expect(
            RichmenuLinkOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          RichmenuLinkOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and somehow richMenu is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValueOnce({ richMenu: '' });
          spyOn(
            RichmenuLinkOperation.linkUserRequest,
            'send'
          ).mockResolvedValue({});
        });

        it('link the rich menu to the user', async () => {
          await expect(RichmenuLinkOperation.run()).resolves.toEqual(false);
          expect(RichmenuLinkOperation.listRequest.send).toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            richMenusPrompt,
            RichmenuLinkOperation.cancelOption
          );
          expect(prompts).toHaveBeenCalledTimes(1);
          expect(
            RichmenuLinkOperation.linkUserRequest.send
          ).not.toHaveBeenCalled();
        });

        afterAll(() => {
          prompts.mockReset();
          RichmenuLinkOperation.linkUserRequest.send.mockReset();
        });
      });

      describe('and user choose a rich menu', () => {
        describe('prompts for user ID', () => {
          const userIdPrompt = {
            type: 'text',
            name: 'userId',
            message: `Link ${richMenu.name} to which user ID`
          };

          describe('and user cancel', () => {
            beforeAll(() => {
              prompts
                .mockImplementationOnce(() => Promise.resolve({ richMenu }))
                .mockImplementationOnce((_, options) => {
                  options.onCancel();
                });
              spyOn(
                RichmenuLinkOperation.cancelOption,
                'onCancel'
              ).mockResolvedValue({});
            });

            it('call onCancel', async () => {
              await expect(
                RichmenuLinkOperation.run().catch(_ => {})
              ).resolves.toEqual();
              expect(RichmenuLinkOperation.listRequest.send).toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                userIdPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(
                RichmenuLinkOperation.linkUserRequest.send
              ).not.toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                richMenusPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(
                RichmenuLinkOperation.cancelOption.onCancel
              ).toHaveBeenCalledTimes(1);
            });

            afterAll(() => {
              RichmenuLinkOperation.cancelOption.onCancel.mockRestore();
              prompts.mockReset();
            });
          });

          describe('and user ID is empty', () => {
            beforeAll(() => {
              prompts.mockResolvedValueOnce({ richMenu });
              prompts.mockResolvedValueOnce({ userId: '' });
              spyOn(
                RichmenuLinkOperation.linkUserRequest,
                'send'
              ).mockResolvedValue({});
            });

            it('link the rich menu to the user', async () => {
              await expect(RichmenuLinkOperation.run()).resolves.toEqual(false);
              expect(RichmenuLinkOperation.listRequest.send).toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                richMenusPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIdPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(
                RichmenuLinkOperation.linkUserRequest.send
              ).not.toHaveBeenCalled();
            });

            afterAll(() => {
              prompts.mockReset();
              RichmenuLinkOperation.linkUserRequest.send.mockReset();
            });
          });

          describe('and able to link the rich menu', () => {
            beforeAll(() => {
              prompts.mockResolvedValueOnce({ richMenu });
              prompts.mockResolvedValueOnce({ userId });
              spyOn(
                RichmenuLinkOperation.linkUserRequest,
                'send'
              ).mockResolvedValue({});
            });

            it('link the rich menu to the user', async () => {
              await expect(RichmenuLinkOperation.run()).resolves.toEqual(true);
              expect(RichmenuLinkOperation.listRequest.send).toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                richMenusPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIdPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(
                RichmenuLinkOperation.linkUserRequest.send
              ).toHaveBeenCalledWith(richMenu.richMenuId, userId);
            });

            afterAll(() => {
              prompts.mockReset();
              RichmenuLinkOperation.linkUserRequest.send.mockReset();
            });
          });

          describe('and NOT able to link the rich menu', () => {
            const error = new Error('failed to remove');

            beforeAll(() => {
              prompts.mockResolvedValueOnce({ richMenu });
              prompts.mockResolvedValueOnce({ userId });
              spyOn(
                RichmenuLinkOperation.linkUserRequest,
                'send'
              ).mockRejectedValue(error);
              spyOn(console, 'error').mockReturnValue(undefined);
            });

            it('handles error', async () => {
              await expect(RichmenuLinkOperation.run()).resolves.toEqual(false);
              expect(RichmenuLinkOperation.listRequest.send).toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                richMenusPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIdPrompt,
                RichmenuLinkOperation.cancelOption
              );
              expect(
                RichmenuLinkOperation.linkUserRequest.send
              ).toHaveBeenCalledWith(richMenu.richMenuId, userId);
            });

            afterAll(() => {
              console.error.mockRestore();
              prompts.mockReset();
              RichmenuLinkOperation.linkUserRequest.send.mockReset();
            });
          });
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      afterAll(() => {
        RichmenuLinkOperation.linkUserRequest.send.mockRestore();
        RichmenuLinkOperation.listRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      RichmenuLinkOperation.config.mockRestore();
      RichmenuLinkOperation.validateConfig.mockRestore();
      console.log.mockRestore();
    });
  });
});
