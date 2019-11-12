import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsGetDevicesOperation from '../things-get-devices-operation';

const { spyOn, mock, unmock } = jest;

describe('things get:devices', () => {
  it('extends Operation', () => {
    expect(
      ThingsGetDevicesOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsGetDevicesOperation.usage).toEqual([
      {
        header: 'Get device information by product ID and user ID'.help,
        content: `things get:devices`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsGetDevicesOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsGetDevicesOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsGetDevicesOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsGetDevicesOperation.validateConfig.mockRestore();
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
      spyOn(ThingsGetDevicesOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsGetDevicesOperation, 'validateConfig').mockReturnValue(true);
    });

    describe('prompt for product ID', () => {
      const deviceIDPrompt = {
        type: 'text',
        name: 'productId',
        message: 'Product ID?'
      };
      let prompts;

      beforeAll(() => {
        mock('prompts');
        prompts = require('prompts');
      });

      describe('when cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            ThingsGetDevicesOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
          spyOn(ThingsGetDevicesOperation.getRequest, 'send').mockRejectedValue(
            new Error('should not be called')
          );
          spyOn(console, 'log').mockReturnValue();
        });

        it('exits gracefully', async () => {
          await expect(ThingsGetDevicesOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            deviceIDPrompt,
            ThingsGetDevicesOperation.cancelOption
          );
          expect(
            ThingsGetDevicesOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
          expect(
            ThingsGetDevicesOperation.getRequest.send
          ).not.toHaveBeenCalled();
          expect(console.log).toHaveBeenCalledWith(
            'Product ID cannot be empty'.error
          );
        });

        afterAll(() => {
          console.log.mockRestore();
          ThingsGetDevicesOperation.getRequest.send.mockRestore();
          ThingsGetDevicesOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when able to get product ID', () => {
        const productId = 'xxxx';

        describe('prompt for user ID', () => {
          const userIDPrompt = {
            type: 'text',
            name: 'userId',
            message: 'User ID?'
          };

          describe('when cancelled', () => {
            beforeAll(() => {
              prompts
                .mockImplementationOnce(() => Promise.resolve({ productId }))
                .mockImplementationOnce((_, options) => {
                  options.onCancel();
                });
              spyOn(
                ThingsGetDevicesOperation.getRequest,
                'send'
              ).mockResolvedValue(new Error('should not be called'));
              spyOn(
                ThingsGetDevicesOperation.cancelOption,
                'onCancel'
              ).mockReturnValue();
              spyOn(console, 'log').mockReturnValue();
              spyOn(console, 'error').mockReturnValue();
            });

            it('exit gracefully', async () => {
              await expect(
                ThingsGetDevicesOperation.run()
              ).resolves.toEqual(false);
              expect(prompts).toHaveBeenCalledWith(
                deviceIDPrompt,
                ThingsGetDevicesOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIDPrompt,
                ThingsGetDevicesOperation.cancelOption
              );
              expect(
                ThingsGetDevicesOperation.cancelOption.onCancel
              ).toHaveBeenCalled();
            });

            afterAll(() => {
              ThingsGetDevicesOperation.cancelOption.onCancel.mockRestore();
              ThingsGetDevicesOperation.getRequest.send.mockRestore();
              console.log.mockRestore();
              console.error.mockRestore();
              prompts.mockReset();
            });
          });

          describe('when user ID is blank', () => {
            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ productId })
                .mockResolvedValueOnce({ userId: '' });
              spyOn(
                ThingsGetDevicesOperation.getRequest,
                'send'
              ).mockRejectedValue(new Error('should not be called'));
              spyOn(console, 'log').mockReturnValue();
            });

            it('handles error', async () => {
              await expect(ThingsGetDevicesOperation.run()).resolves.toEqual(
                false
              );
              expect(prompts).toHaveBeenCalledWith(
                deviceIDPrompt,
                ThingsGetDevicesOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIDPrompt,
                ThingsGetDevicesOperation.cancelOption
              );
              expect(
                ThingsGetDevicesOperation.getRequest.send
              ).not.toHaveBeenCalled();
              expect(console.log).toHaveBeenCalledWith(`User ID cannot be empty`.error);
            });

            afterAll(() => {
              ThingsGetDevicesOperation.getRequest.send.mockRestore();
              console.log.mockRestore();
              prompts.mockReset();
            });
          });

          describe('when able to get user ID', () => {
            const userId = 'yyyy';

            describe('send get request', () => {
              const mockResponse = {
                data: {
                  items: []
                }
              };

              describe('when able to get data', () => {
                beforeAll(() => {
                  prompts
                    .mockResolvedValueOnce({ productId })
                    .mockResolvedValueOnce({ userId });
                  spyOn(
                    ThingsGetDevicesOperation.getRequest,
                    'send'
                  ).mockResolvedValue(mockResponse);
                  spyOn(console, 'log').mockReturnValue();
                });

                it('display data correctly', async () => {
                  await expect(ThingsGetDevicesOperation.run()).resolves.toEqual(
                    true
                  );
                  expect(
                    ThingsGetDevicesOperation.getRequest.send
                  ).toHaveBeenCalledWith(productId, userId);
                  expect(console.log).toHaveBeenCalledWith(mockResponse.data.items);
                });

                afterAll(() => {
                  ThingsGetDevicesOperation.getRequest.send.mockRestore();
                  console.log.mockRestore();
                  prompts.mockReset();
                });
              });

              describe('when failed to get data', () => {
                const error = new Error('failed to get data');

                beforeAll(() => {
                  prompts
                    .mockResolvedValueOnce({ productId })
                    .mockResolvedValueOnce({ userId });
                  spyOn(
                    ThingsGetDevicesOperation.getRequest,
                    'send'
                  ).mockRejectedValue(error);
                  spyOn(ThingsGetDevicesOperation, 'logAxiosError').mockReturnValue();
                });

                it('handles error', async () => {
                  await expect(ThingsGetDevicesOperation.run()).resolves.toEqual(
                    false
                  );
                  expect(
                    ThingsGetDevicesOperation.getRequest.send
                  ).toHaveBeenCalledWith(productId, userId);
                  expect(ThingsGetDevicesOperation.logAxiosError).toHaveBeenCalledWith(error);
                });

                afterAll(() => {
                  ThingsGetDevicesOperation.getRequest.send.mockRestore();
                  ThingsGetDevicesOperation.logAxiosError.mockRestore();
                  prompts.mockReset();
                });
              });
            });
          });
        });

        afterAll(() => {});
      });

      afterAll(() => {
        unmock('prompts');
      });
    });

    afterAll(() => {
      ThingsGetDevicesOperation.config.mockRestore();
      ThingsGetDevicesOperation.validateConfig.mockRestore();
    });
  });
});
