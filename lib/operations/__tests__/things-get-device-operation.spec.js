import 'console-table';

import ThingsOperation from '../things-operation';
import ThingsGetDeviceOperation from '../things-get-device-operation';

const { spyOn, mock, unmock } = jest;

describe('things add:trial', () => {
  it('extends Operation', () => {
    expect(
      ThingsGetDeviceOperation.prototype instanceof ThingsOperation
    ).toEqual(true);
  });

  it('has usage', () => {
    expect(ThingsGetDeviceOperation.usage).toEqual([
      {
        header: 'Get device information by device ID and/or with user ID'.help,
        content: `things get:device`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof ThingsGetDeviceOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(ThingsGetDeviceOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(ThingsGetDeviceOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      ThingsGetDeviceOperation.validateConfig.mockRestore();
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
      spyOn(ThingsGetDeviceOperation, 'config', 'get').mockReturnValue(
        mockConfig
      );
      spyOn(ThingsGetDeviceOperation, 'validateConfig').mockReturnValue(true);
    });

    describe('prompt for device ID', () => {
      const deviceIDPrompt = {
        type: 'text',
        name: 'deviceId',
        message: 'Device ID?'
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
            ThingsGetDeviceOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
          spyOn(ThingsGetDeviceOperation.getRequest, 'send').mockRejectedValue(
            new Error('should not be called')
          );
          spyOn(
            ThingsGetDeviceOperation.getWithUserRequest,
            'send'
          ).mockRejectedValue(new Error('should not be called'));
          spyOn(console, 'log').mockReturnValue();
        });

        it('exits gracefully', async () => {
          await expect(ThingsGetDeviceOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            deviceIDPrompt,
            ThingsGetDeviceOperation.cancelOption
          );
          expect(
            ThingsGetDeviceOperation.cancelOption.onCancel
          ).toHaveBeenCalled();
          expect(
            ThingsGetDeviceOperation.getRequest.send
          ).not.toHaveBeenCalled();
          expect(
            ThingsGetDeviceOperation.getWithUserRequest.send
          ).not.toHaveBeenCalled();
          expect(console.log).toHaveBeenCalledWith(
            'Device ID cannot be empty'.error
          );
        });

        afterAll(() => {
          console.log.mockRestore();
          ThingsGetDeviceOperation.getRequest.send.mockRestore();
          ThingsGetDeviceOperation.getWithUserRequest.send.mockRestore();
          ThingsGetDeviceOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('when able to get device ID', () => {
        const deviceId = 'xxxx';

        describe('prompt for user ID', () => {
          const userIDPrompt = {
            type: 'text',
            name: 'userId',
            message: 'Specific user ID? [Optional]'
          };

          describe('when cancelled', () => {
            const mockResponse = {
              data: {}
            };

            beforeAll(() => {
              prompts
                .mockImplementationOnce(() => Promise.resolve({ deviceId }))
                .mockImplementationOnce((_, options) => {
                  options.onCancel();
                });
              spyOn(
                ThingsGetDeviceOperation.getRequest,
                'send'
              ).mockResolvedValue(new Error('should not be called'));
              spyOn(
                ThingsGetDeviceOperation.getWithUserRequest,
                'send'
              ).mockRejectedValue(new Error('should not be called'));
              spyOn(
                ThingsGetDeviceOperation.cancelOption,
                'onCancel'
              ).mockReturnValue();
              spyOn(console, 'log').mockReturnValue();
              spyOn(console, 'error').mockReturnValue();
            });

            it('exit gracefully', async () => {
              await expect(
                ThingsGetDeviceOperation.run() // Actual program will not throw, due to process.exit(0)
              ).resolves.toEqual(true); // Acutal program will resolves false. TODO: simulate process.exit(0) to stop program before sending request
              expect(prompts).toHaveBeenCalledWith(
                deviceIDPrompt,
                ThingsGetDeviceOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIDPrompt,
                ThingsGetDeviceOperation.cancelOption
              );
              expect(
                ThingsGetDeviceOperation.cancelOption.onCancel
              ).toHaveBeenCalled();
            });

            afterAll(() => {
              ThingsGetDeviceOperation.cancelOption.onCancel.mockRestore();
              ThingsGetDeviceOperation.getRequest.send.mockRestore();
              ThingsGetDeviceOperation.getWithUserRequest.send.mockRestore();
              console.log.mockRestore();
              console.error.mockRestore();
              prompts.mockReset();
            });
          });

          describe('when user ID is blank', () => {
            const mockResponse = {
              data: {}
            };

            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ deviceId })
                .mockResolvedValueOnce({ userId: '' });
              spyOn(
                ThingsGetDeviceOperation.getRequest,
                'send'
              ).mockResolvedValue(mockResponse);
              spyOn(
                ThingsGetDeviceOperation.getWithUserRequest,
                'send'
              ).mockRejectedValue(new Error('should not be called'));
              spyOn(console, 'log').mockReturnValue();
            });

            it('send get request without user ID', async () => {
              await expect(ThingsGetDeviceOperation.run()).resolves.toEqual(
                true
              );
              expect(prompts).toHaveBeenCalledWith(
                deviceIDPrompt,
                ThingsGetDeviceOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                userIDPrompt,
                ThingsGetDeviceOperation.cancelOption
              );
              expect(
                ThingsGetDeviceOperation.getRequest.send
              ).toHaveBeenCalledWith(deviceId);
              expect(
                ThingsGetDeviceOperation.getWithUserRequest.send
              ).not.toHaveBeenCalled();
              expect(console.log).toHaveBeenCalledWith(mockResponse.data);
            });

            afterAll(() => {
              ThingsGetDeviceOperation.getRequest.send.mockRestore();
              ThingsGetDeviceOperation.getWithUserRequest.send.mockRestore();
              console.log.mockRestore();
              prompts.mockReset();
            });
          });

          describe('when able to get device ID', () => {
            const userId = 'yyyy';

            describe('send get request', () => {
              const mockResponse = {
                data: {}
              };

              describe('when able to get data', () => {
                beforeAll(() => {
                  prompts
                    .mockResolvedValueOnce({ deviceId })
                    .mockResolvedValueOnce({ userId });
                  spyOn(
                    ThingsGetDeviceOperation.getWithUserRequest,
                    'send'
                  ).mockResolvedValue(mockResponse);
                  spyOn(
                    ThingsGetDeviceOperation.getRequest,
                    'send'
                  ).mockRejectedValue(new Error('should not be called'));
                  spyOn(console, 'log').mockReturnValue();
                });

                it('display data correctly', async () => {
                  await expect(ThingsGetDeviceOperation.run()).resolves.toEqual(
                    true
                  );
                  expect(
                    ThingsGetDeviceOperation.getWithUserRequest.send
                  ).toHaveBeenCalledWith(deviceId, userId);
                  expect(
                    ThingsGetDeviceOperation.getRequest.send
                  ).not.toHaveBeenCalled();
                  expect(console.log).toHaveBeenCalledWith(mockResponse.data);
                });

                afterAll(() => {
                  ThingsGetDeviceOperation.getRequest.send.mockRestore();
                  ThingsGetDeviceOperation.getWithUserRequest.send.mockRestore();
                  console.log.mockRestore();
                  prompts.mockReset();
                });
              });

              describe('when failed to get data', () => {
                const error = new Error('failed to get data');

                beforeAll(() => {
                  prompts
                    .mockResolvedValueOnce({ deviceId })
                    .mockResolvedValueOnce({ userId });
                  spyOn(
                    ThingsGetDeviceOperation.getWithUserRequest,
                    'send'
                  ).mockRejectedValue(error);
                  spyOn(
                    ThingsGetDeviceOperation.getRequest,
                    'send'
                  ).mockRejectedValue(new Error('should not be called'));
                  spyOn(ThingsGetDeviceOperation, 'logAxiosError').mockReturnValue();
                });

                it('handles error', async () => {
                  await expect(ThingsGetDeviceOperation.run()).resolves.toEqual(
                    false
                  );
                  expect(
                    ThingsGetDeviceOperation.getWithUserRequest.send
                  ).toHaveBeenCalledWith(deviceId, userId);
                  expect(
                    ThingsGetDeviceOperation.getRequest.send
                  ).not.toHaveBeenCalled();
                  expect(ThingsGetDeviceOperation.logAxiosError).toHaveBeenCalledWith(error);
                });

                afterAll(() => {
                  ThingsGetDeviceOperation.getRequest.send.mockRestore();
                  ThingsGetDeviceOperation.getWithUserRequest.send.mockRestore();
                  ThingsGetDeviceOperation.logAxiosError.mockRestore();
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
      ThingsGetDeviceOperation.config.mockRestore();
      ThingsGetDeviceOperation.validateConfig.mockRestore();
    });
  });
});
