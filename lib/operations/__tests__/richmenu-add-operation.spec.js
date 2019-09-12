import path from 'path';
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
    let prompts;

    beforeAll(() => {
      spyOn(RichmenuAddOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(RichmenuAddOperation, 'validateConfig').mockReturnValue(true);
      mock('prompts');
      prompts = require('prompts');
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    describe('prompts for data file path', () => {
      const dataFilePathPrompt = {
        type: 'text',
        name: 'dataFilePath',
        message: 'Input data file path',
        validate: RichmenuAddOperation.validateFileExists
      };

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(
            RichmenuAddOperation.cancelOption,
            'onCancel'
          ).mockResolvedValue({});
        });

        it('call onCancel', async () => {
          await expect(RichmenuAddOperation.run().catch(_ => {}));
          expect(prompts).toHaveBeenCalledWith(
            dataFilePathPrompt,
            RichmenuAddOperation.cancelOption
          );
          expect(RichmenuAddOperation.cancelOption.onCancel).toHaveBeenCalled();
        });

        afterAll(() => {
          RichmenuAddOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and prompts somehow return empty string', () => {
        beforeAll(() => {
          prompts.mockResolvedValueOnce({ dataFilePath: '' });
        });

        it('return false', async () => {
          await expect(RichmenuAddOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            dataFilePathPrompt,
            RichmenuAddOperation.cancelOption
          );
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      describe('and user input correct data file path', () => {
        describe('prompts for image file path', () => {
          const imageFilePathPrompt = {
            type: 'text',
            name: 'imageFilePath',
            message: 'Input image file path',
            validate: RichmenuAddOperation.validateFileExists
          };

          describe('and user cancel', () => {
            beforeAll(() => {
              prompts
                .mockImplementationOnce(() =>
                  Promise.resolve({
                    dataFilePath: '/some/data/file/path'
                  })
                )
                .mockImplementationOnce((_, options) => {
                  options.onCancel();
                });
              spyOn(
                RichmenuAddOperation.cancelOption,
                'onCancel'
              ).mockResolvedValue({});
            });

            it('call onCancel', async () => {
              await expect(RichmenuAddOperation.run().catch(_ => {}));
              expect(prompts.mock.calls[0][0]).toEqual(dataFilePathPrompt);
              expect(prompts.mock.calls[1][0]).toEqual(imageFilePathPrompt);
              expect(
                RichmenuAddOperation.cancelOption.onCancel
              ).toHaveBeenCalled();
            });

            afterAll(() => {
              RichmenuAddOperation.cancelOption.onCancel.mockRestore();
              prompts.mockReset();
            });
          });

          describe('and prompts somehow return empty string', () => {
            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ dataFilePath: '/data/path' })
                .mockResolvedValueOnce({ imageFilePath: '' });
            });

            it('return false', async () => {
              await expect(RichmenuAddOperation.run()).resolves.toEqual(false);
              expect(prompts.mock.calls[0][0]).toEqual(dataFilePathPrompt);
              expect(prompts.mock.calls[1][0]).toEqual(imageFilePathPrompt);
            });

            afterAll(() => {
              prompts.mockReset();
            });
          });

          describe('and user input correct image file path', () => {
            const dataFilePath = path.resolve(
              __dirname,
              '../__mocks__/data-file.json'
            );
            const dataFile = require(dataFilePath);
            const imageFilePath = path.resolve(
              __dirname,
              '../__mocks__/image-file.jpg'
            );

            beforeEach(() => {
              prompts
                .mockResolvedValueOnce({ dataFilePath })
                .mockResolvedValueOnce({ imageFilePath });
            });

            describe('when failed sending add request', () => {
              const error = new Error('add request error');

              beforeAll(() => {
                spyOn(
                  RichmenuAddOperation.addRequest,
                  'send'
                ).mockImplementationOnce(() => {
                  throw error;
                });
                spyOn(console, 'error').mockReturnValue(undefined);
              });

              it('return false', async () => {
                await expect(RichmenuAddOperation.run()).resolves.toEqual(
                  false
                );
                expect(prompts.mock.calls[0][0]).toEqual(dataFilePathPrompt);
                expect(prompts.mock.calls[1][0]).toEqual(imageFilePathPrompt);
                expect(
                  RichmenuAddOperation.addRequest.send
                ).toHaveBeenCalledWith(dataFile);
                expect(console.error).toHaveBeenCalledWith(error);
              });

              afterAll(() => {
                RichmenuAddOperation.addRequest.send.mockRestore();
                console.error.mockRestore();
              });
            });

            describe('when successfully add rich menu', () => {
              const richMenuId = 'richMenuId_XXX';
              const mockAddResponse = { data: { richMenuId } };

              beforeEach(() => {
                console.log.mockClear();
                spyOn(
                  RichmenuAddOperation.addRequest,
                  'send'
                ).mockResolvedValue(mockAddResponse);
              });

              describe('and failed to upload rich menu', () => {
                const error = new Error('upload failed');

                beforeAll(() => {
                  spyOn(
                    RichmenuAddOperation.uploadRequest,
                    'send'
                  ).mockImplementation(() => {
                    throw error;
                  });
                  spyOn(console, 'error').mockReturnValue(undefined);
                });

                it('handles error', async () => {
                  await expect(RichmenuAddOperation.run()).resolves.toEqual(
                    false
                  );
                  expect(prompts.mock.calls[0][0]).toEqual(dataFilePathPrompt);
                  expect(prompts.mock.calls[1][0]).toEqual(imageFilePathPrompt);
                  expect(
                    RichmenuAddOperation.addRequest.send
                  ).toHaveBeenCalledWith(dataFile);
                  expect(console.log).toHaveBeenCalledWith(`Rich menu ID: ${richMenuId.data}`.success);
                  expect(
                    RichmenuAddOperation.uploadRequest.send
                  ).toHaveBeenCalledWith(richMenuId, imageFilePath);
                  expect(console.error).toHaveBeenCalledWith(error);
                });

                afterAll(() => {
                  RichmenuAddOperation.uploadRequest.mockRestore();
                  console.error.mockRestore();
                });
              });

              describe('and successfully upload rich menu', () => {
                beforeAll(() => {
                  spyOn(
                    RichmenuAddOperation.uploadRequest,
                    'send'
                  ).mockResolvedValue({});
                });

                it('return true', async () => {
                  await expect(RichmenuAddOperation.run()).resolves.toEqual(
                    true
                  );
                  expect(prompts.mock.calls[0][0]).toEqual(dataFilePathPrompt);
                  expect(prompts.mock.calls[1][0]).toEqual(imageFilePathPrompt);
                  expect(
                    RichmenuAddOperation.addRequest.send
                  ).toHaveBeenCalledWith(dataFile);
                  expect(console.log).toHaveBeenCalledWith(`Rich menu ID: ${richMenuId.data}`.success);
                  expect(
                    RichmenuAddOperation.uploadRequest.send
                  ).toHaveBeenCalledWith(richMenuId, imageFilePath);
                  expect(console.log).toHaveBeenCalledWith(`Rich menu image uploaded`.success);
                  expect(console.log).toHaveBeenCalledTimes(2);
                });

                afterAll(() => {
                  RichmenuAddOperation.uploadRequest.mockRestore();
                });
              });

              afterAll(() => {
                RichmenuAddOperation.addRequest.send.mockRestore();
              });
            });

            afterEach(() => {
              prompts.mockReset();
            });
          });
        });
      });
    });

    afterAll(() => {
      RichmenuAddOperation.config.mockRestore();
      RichmenuAddOperation.validateConfig.mockRestore();
      console.log.mockRestore();
      prompts.mockRestore();
      unmock('prompts');
    });
  });
});
