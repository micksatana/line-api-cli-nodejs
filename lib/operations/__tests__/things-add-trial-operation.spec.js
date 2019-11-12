import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsAddTrialOperation from '../things-add-trial-operation';

const { spyOn, mock, unmock } = jest;

describe('things add:trial', () => {
  it('extends Operation', () => {
    expect(
      ThingsAddTrialOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsAddTrialOperation.usage).toEqual([
      {
        header: 'Add a trial product'.help,
        content: `things add:trial`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsAddTrialOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsAddTrialOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsAddTrialOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsAddTrialOperation.validateConfig.mockRestore();
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
      spyOn(ThingsAddTrialOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsAddTrialOperation, 'validateConfig').mockReturnValue(true);
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(console, 'table').mockReturnValue(undefined);
    });

    beforeEach(() => {
      console.log.mockClear();
      console.table.mockClear();
    });

    describe('when failed to list LIFF apps', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(ThingsAddTrialOperation.listRequest, 'send').mockRejectedValue(
          error
        );
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(ThingsAddTrialOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        ThingsAddTrialOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no LIFF app data', () => {
      beforeAll(() => {
        spyOn(ThingsAddTrialOperation.listRequest, 'send')
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
        await expect(ThingsAddTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
        console.log.mockClear();
        // Test no liffs
        await expect(ThingsAddTrialOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
      });

      afterAll(() => {
        ThingsAddTrialOperation.listRequest.send.mockRestore();
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
        message: 'Select a LIFF app to add a trial product',
        choices
      };
      const productNamePrompt = {
        type: 'text',
        name: 'productName',
        message: 'Product name?'
      };
      const productName = 'mocked product';
      let prompts;

      beforeAll(() => {
        spyOn(ThingsAddTrialOperation.listRequest, 'send').mockResolvedValue(
          mockResponse
        );
        spyOn(ThingsAddTrialOperation.addRequest, 'send').mockResolvedValue({});
        mock('prompts');
        prompts = require('prompts');
      });

      beforeEach(() => {
        ThingsAddTrialOperation.listRequest.send.mockClear();
        ThingsAddTrialOperation.addRequest.send.mockClear();
      });

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            ThingsAddTrialOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(
            ThingsAddTrialOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(ThingsAddTrialOperation.listRequest.send).toHaveBeenCalled();
          expect(
            ThingsAddTrialOperation.addRequest.send
          ).not.toHaveBeenCalled();
          expect(prompts).toHaveBeenCalledWith(
            appsPrompt,
            ThingsAddTrialOperation.cancelOption
          );
          expect(
            ThingsAddTrialOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
        });

        afterAll(() => {
          ThingsAddTrialOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and user choose a LIFF app', () => {
        const mockAddResponse = {
          data: [
            {
              id: '6557519507539544975',
              name: 'mickTestDevice',
              type: 'BLE',
              channelId: 1600202838,
              actionUri: 'line://app/1600202838-Ad4zPrEd',
              serviceUuid: '2391f468-ecf0-4c7e-a76b-f622108e3b23',
              psdiServiceUuid: 'e625601e-9e55-4597-a598-76018a0d293d',
              psdiCharacteristicUuid: '26e2b12b-85f0-4f3f-9fdd-91d114270e6e'
            }
          ]
        };
        const mockTableRow = {
          ID: mockAddResponse.data[0].id,
          Name: mockAddResponse.data[0].name,
          Type: mockAddResponse.data[0].type,
          'Channel ID': mockAddResponse.data[0].channelId,
          'Service UUID': mockAddResponse.data[0].serviceUuid,
          'PSDI Service UUID': mockAddResponse.data[0].psdiServiceUuid,
          'PSDI Characteristic UUID':
            mockAddResponse.data[0].psdiCharacteristicUuid
        };

        describe('and input product name', () => {
          describe('and able to add a trial product', () => {
            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ liffId })
                .mockResolvedValueOnce({ productName });
              spyOn(
                ThingsAddTrialOperation.addRequest,
                'send'
              ).mockResolvedValue(mockAddResponse);
              spyOn(ThingsOperation, 'productsToTableData').mockReturnValue([
                mockTableRow
              ]);
            });

            it('add a trial product', async () => {
              await expect(ThingsAddTrialOperation.run()).resolves.toEqual(
                true
              );
              expect(
                ThingsAddTrialOperation.listRequest.send
              ).toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                appsPrompt,
                ThingsAddTrialOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                productNamePrompt,
                ThingsAddTrialOperation.cancelOption
              );
              expect(
                ThingsAddTrialOperation.addRequest.send
              ).toHaveBeenCalledWith(liffId, productName);
              expect(ThingsOperation.productsToTableData).toHaveBeenCalledWith([
                mockAddResponse.data
              ]);
              expect(console.table).toHaveBeenCalledWith([mockTableRow]);
            });

            afterAll(() => {
              prompts.mockReset();
              ThingsAddTrialOperation.addRequest.send.mockReset();
              ThingsOperation.productsToTableData.mockRestore();
            });
          });

          describe('and NOT able to add a trial product', () => {
            const error = new Error('failed to remove');

            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ liffId })
                .mockResolvedValueOnce({ productName });
              spyOn(
                ThingsAddTrialOperation.addRequest,
                'send'
              ).mockRejectedValue(error);
              spyOn(console, 'error').mockReturnValue(undefined);
            });

            it('handles error', async () => {
              await expect(ThingsAddTrialOperation.run()).resolves.toEqual(
                false
              );
              expect(
                ThingsAddTrialOperation.listRequest.send
              ).toHaveBeenCalled();
              expect(prompts).toHaveBeenCalledWith(
                appsPrompt,
                ThingsAddTrialOperation.cancelOption
              );
              expect(
                ThingsAddTrialOperation.addRequest.send
              ).toHaveBeenCalledWith(liffId, productName);
            });

            afterAll(() => {
              console.error.mockRestore();
              prompts.mockReset();
              ThingsAddTrialOperation.addRequest.send.mockReset();
            });
          });
        });

        describe('and left product name blank', () => {
          beforeAll(() => {
            prompts
              .mockResolvedValueOnce({ liffId })
              .mockResolvedValueOnce({ productName: '' });
            spyOn(ThingsAddTrialOperation.addRequest, 'send').mockRejectedValue(
              new Error('should not be called')
            );
            spyOn(console, 'log').mockReturnValue();
          });

          it('handles error', async () => {
            await expect(ThingsAddTrialOperation.run()).resolves.toEqual(
              false
            );
            expect(
              ThingsAddTrialOperation.listRequest.send
            ).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              appsPrompt,
              ThingsAddTrialOperation.cancelOption
            );
            expect(
              ThingsAddTrialOperation.addRequest.send
            ).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('Product name cannot be empty'.error)
          });

          afterAll(() => {
            console.log.mockRestore();
            prompts.mockReset();
            ThingsAddTrialOperation.addRequest.send.mockReset();
          });
        });
      });

      afterAll(() => {
        ThingsAddTrialOperation.addRequest.send.mockRestore();
        ThingsAddTrialOperation.listRequest.send.mockRestore();
        prompts.mockRestore();
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsAddTrialOperation.config.mockRestore();
      ThingsAddTrialOperation.validateConfig.mockRestore();
      console.table.mockRestore();
      console.log.mockRestore();
    });
  });
});
