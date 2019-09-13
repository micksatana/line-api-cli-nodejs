import Operation from '../operation';
import RichmenuRemoveOperation from '../richmenu-remove-operation';

const { spyOn, mock, unmock } = jest;

describe('richmenu remove', () => {
  it('extends Operation', () => {
    expect(RichmenuRemoveOperation.prototype instanceof Operation).toEqual(
      true
    );
  });

  it('has usage', () => {
    expect(RichmenuRemoveOperation.usage).toEqual([
      {
        header: 'Remove a rich menu'.help,
        content: `richmenu remove`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof RichmenuRemoveOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(RichmenuRemoveOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(RichmenuRemoveOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      RichmenuRemoveOperation.validateConfig.mockRestore();
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
      spyOn(RichmenuRemoveOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(RichmenuRemoveOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
    });

    describe('when failed to list rich menus', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(RichmenuRemoveOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(RichmenuRemoveOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        RichmenuRemoveOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no rich menu data', () => {
      beforeAll(() => {
        spyOn(RichmenuRemoveOperation.listRequest, 'send')
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
        await expect(RichmenuRemoveOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
        console.log.mockClear();
        // Test no richmenus
        await expect(RichmenuRemoveOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('Rich menu not found'.info);
      });

      afterAll(() => {
        RichmenuRemoveOperation.listRequest.send.mockRestore();
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
        message: 'Select a rich menu to be removed',
        choices: [
          {
            title: `${mockResponse.data.richmenus[0].name} [${mockResponse.data.richmenus[0].richMenuId}]`,
            description: `${mockResponse.data.richmenus[0].chatBarText} has ${mockResponse.data.richmenus[0].areas.length} areas`,
            value: mockResponse.data.richmenus[0].richMenuId
          }
        ]
      };

      beforeAll(() => {
        spyOn(RichmenuRemoveOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(RichmenuRemoveOperation.removeRequest, 'send').mockResolvedValue(
          {}
        );
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        RichmenuRemoveOperation.listRequest.send.mockClear();
        RichmenuRemoveOperation.removeRequest.send.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            RichmenuRemoveOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            RichmenuRemoveOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(RichmenuRemoveOperation.listRequest.send).toHaveBeenCalled();
          expect(
            RichmenuRemoveOperation.removeRequest.send
          ).not.toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            richMenusPrompt,
            RichmenuRemoveOperation.cancelOption
          );
          expect(
            RichmenuRemoveOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          RichmenuRemoveOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and user choose a rich menu', () => {
        describe('and able to remove the rich menu', () => {
          beforeAll(() => {
            prompts.mockResolvedValueOnce({ richMenuId });
            spyOn(
              RichmenuRemoveOperation.removeRequest,
              'send'
            ).mockResolvedValue({});
          });

          it('remove the rich menu', async () => {
            await expect(RichmenuRemoveOperation.run()).resolves.toEqual(true);
            expect(RichmenuRemoveOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              richMenusPrompt,
              RichmenuRemoveOperation.cancelOption
            );
            expect(
              RichmenuRemoveOperation.removeRequest.send
            ).toHaveBeenCalledWith(richMenuId);
          });

          afterAll(() => {
            prompts.mockReset();
            RichmenuRemoveOperation.removeRequest.send.mockReset();
          });
        });

        describe('and NOT able to remove the rich menu', () => {
          const error = new Error('failed to remove');

          beforeAll(() => {
            prompts.mockResolvedValueOnce({ richMenuId });
            spyOn(
              RichmenuRemoveOperation.removeRequest,
              'send'
            ).mockRejectedValue(error);
            spyOn(console, 'error').mockReturnValue(undefined);
          });

          it('handles error', async () => {
            await expect(RichmenuRemoveOperation.run()).resolves.toEqual(false);
            expect(RichmenuRemoveOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              richMenusPrompt,
              RichmenuRemoveOperation.cancelOption
            );
            expect(
              RichmenuRemoveOperation.removeRequest.send
            ).toHaveBeenCalledWith(richMenuId);
          });

          afterAll(() => {
            console.error.mockRestore();
            prompts.mockReset();
            RichmenuRemoveOperation.removeRequest.send.mockReset();
          });
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      afterAll(() => {
        RichmenuRemoveOperation.removeRequest.send.mockRestore();
        RichmenuRemoveOperation.listRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      RichmenuRemoveOperation.config.mockRestore();
      RichmenuRemoveOperation.validateConfig.mockRestore();
      console.log.mockRestore();
    });
  });
});
