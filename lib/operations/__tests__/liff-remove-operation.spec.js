import Operation from '../operation';
import LIFFRemoveOperation from '../liff-remove-operation';

const { spyOn, mock, unmock } = jest;

describe('liff remove', () => {
  it('extends Operation', () => {
    expect(LIFFRemoveOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LIFFRemoveOperation.usage).toEqual([
      {
        header: 'Remove a LIFF app'.help,
        content: `liff remove`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LIFFRemoveOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LIFFRemoveOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LIFFRemoveOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LIFFRemoveOperation.validateConfig.mockRestore();
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
      spyOn(LIFFRemoveOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LIFFRemoveOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
    });

    describe('when failed to list LIFF apps', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(LIFFRemoveOperation.listRequest, 'send').mockRejectedValue(error);
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(LIFFRemoveOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        LIFFRemoveOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no LIFF app data', () => {
      beforeAll(() => {
        spyOn(LIFFRemoveOperation.listRequest, 'send')
          .mockResolvedValueOnce({
            data: {
              liffs: []
            }
          })
          .mockResolvedValueOnce({
            data: {}
          });
      });

      it('handles error', async () => {
        // Test empty liffs
        await expect(LIFFRemoveOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
        console.log.mockClear();
        // Test no liffs
        await expect(LIFFRemoveOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
      });

      afterAll(() => {
        LIFFRemoveOperation.listRequest.send.mockRestore();
      });
    });

    describe('when has LIFF apps', () => {
      const apps = [
        {
          liffId: 'xxxx',
          view: {
            type: 'full',
            url: 'https://www.intocode.io'
          },
          description: 'With BLE',
          features: {
            ble: true
          }
        },
        {
          liffId: 'yyyy',
          view: {
            type: 'full',
            url: 'https://www.intocode.io'
          },
          description: 'Without BLE'
        }
      ];
      const liffId = 'xxxx';
      const mockResponse = {
        data: {
          apps
        }
      };
      const choices = apps.map(app => {
        return {
          title: `${app.view.type} ${app.view.url} [${app.liffId}]`,
          description: app.description,
          value: app.liffId
        };
      });
      const appsPrompt = {
        type: 'select',
        name: 'liffId',
        message: 'Select a LIFF app to be removed',
        choices
      };

      beforeAll(() => {
        spyOn(LIFFRemoveOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(LIFFRemoveOperation.removeRequest, 'send').mockResolvedValue({});
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        LIFFRemoveOperation.listRequest.send.mockClear();
        LIFFRemoveOperation.removeRequest.send.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(LIFFRemoveOperation.cancelOption, 'onCancel').mockResolvedValue(
            {}
          );
        });

        it('call onCancel', async () => {
          await expect(
            LIFFRemoveOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(LIFFRemoveOperation.listRequest.send).toHaveBeenCalled();
          expect(LIFFRemoveOperation.removeRequest.send).not.toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            appsPrompt,
            LIFFRemoveOperation.cancelOption
          );
          expect(LIFFRemoveOperation.cancelOption.onCancel).toHaveBeenCalled();
        });

        afterAll(() => {
          LIFFRemoveOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and user choose a LIFF app', () => {
        describe('and able to remove the LIFF app', () => {
          beforeAll(() => {
            prompts.mockResolvedValueOnce({ liffId });
            spyOn(LIFFRemoveOperation.removeRequest, 'send').mockResolvedValue(
              {}
            );
          });

          it('remove the LIFF app', async () => {
            await expect(LIFFRemoveOperation.run()).resolves.toEqual(true);
            expect(LIFFRemoveOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              appsPrompt,
              LIFFRemoveOperation.cancelOption
            );
            expect(LIFFRemoveOperation.removeRequest.send).toHaveBeenCalledWith(
              liffId
            );
          });

          afterAll(() => {
            prompts.mockReset();
            LIFFRemoveOperation.removeRequest.send.mockReset();
          });
        });

        describe('and NOT able to remove the LIFF app', () => {
          const error = new Error('failed to remove');

          beforeAll(() => {
            prompts.mockResolvedValueOnce({ liffId });
            spyOn(LIFFRemoveOperation.removeRequest, 'send').mockRejectedValue(
              error
            );
            spyOn(console, 'error').mockReturnValue(undefined);
          });

          it('handles error', async () => {
            await expect(LIFFRemoveOperation.run()).resolves.toEqual(false);
            expect(LIFFRemoveOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              appsPrompt,
              LIFFRemoveOperation.cancelOption
            );
            expect(LIFFRemoveOperation.removeRequest.send).toHaveBeenCalledWith(
              liffId
            );
          });

          afterAll(() => {
            console.error.mockRestore();
            prompts.mockReset();
            LIFFRemoveOperation.removeRequest.send.mockReset();
          });
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      afterAll(() => {
        LIFFRemoveOperation.removeRequest.send.mockRestore();
        LIFFRemoveOperation.listRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      LIFFRemoveOperation.config.mockRestore();
      LIFFRemoveOperation.validateConfig.mockRestore();
      console.log.mockRestore();
    });
  });
});
