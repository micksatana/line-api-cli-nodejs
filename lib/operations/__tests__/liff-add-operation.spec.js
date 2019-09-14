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
        type: 'select',
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

      describe('and user cancel', () => {
        beforeAll(() => {
          prompts.mockImplementationOnce((_, options) => {
            options.onCancel();
          });
          spyOn(LIFFAddOperation.cancelOption, 'onCancel').mockImplementation(
            {}
          );
        });

        it('call onCancel', async () => {
          await expect(
            LIFFAddOperation.run().catch(_ => {})
          ).resolves.toEqual();
          expect(prompts).toHaveBeenCalledWith(
            viewTypePrompt,
            LIFFAddOperation.cancelOption
          );
          expect(LIFFAddOperation.cancelOption.onCancel).toHaveBeenCalled();
        });

        afterAll(() => {
          LIFFAddOperation.cancelOption.onCancel.mockRestore();
          prompts.mockReset();
        });
      });

      describe('and somehow view type is empty', () => {
        beforeAll(() => {
          prompts.mockResolvedValue({ viewType: '' });
        });

        it('resolves false', async () => {
          await expect(LIFFAddOperation.run()).resolves.toEqual(false);
          expect(prompts).toHaveBeenCalledWith(
            viewTypePrompt,
            LIFFAddOperation.cancelOption
          );
        });

        afterAll(() => {
          prompts.mockReset();
        });
      });

      describe('and user select a view type', () => {
        const viewType = 'compact';

        describe('prompts for view URL', () => {
          const viewUrlPrompt = {
            type: 'text',
            name: 'viewUrl',
            message: 'View URL'
          };

          describe('and user cancel', () => {
            beforeAll(() => {
              prompts
                .mockImplementationOnce(() => Promise.resolve({ viewType }))
                .mockImplementationOnce((_, options) => {
                  options.onCancel();
                });
              spyOn(
                LIFFAddOperation.cancelOption,
                'onCancel'
              ).mockResolvedValue({});
            });

            it('call onCancel', async () => {
              await expect(
                LIFFAddOperation.run().catch(_ => {})
              ).resolves.toEqual();
              expect(prompts).toHaveBeenCalledWith(
                viewTypePrompt,
                LIFFAddOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                viewUrlPrompt,
                LIFFAddOperation.cancelOption
              );
              expect(LIFFAddOperation.cancelOption.onCancel).toHaveBeenCalled();
            });

            afterAll(() => {
              LIFFAddOperation.cancelOption.onCancel.mockRestore();
              prompts.mockReset();
            });
          });

          describe('and view URL is empty', () => {
            beforeAll(() => {
              prompts
                .mockResolvedValueOnce({ viewType })
                .mockResolvedValueOnce({ viewUrl: '' });
            });

            it('resolves false', async () => {
              await expect(LIFFAddOperation.run()).resolves.toEqual(false);
              expect(prompts).toHaveBeenCalledTimes(2);
              expect(prompts).toHaveBeenCalledWith(
                viewTypePrompt,
                LIFFAddOperation.cancelOption
              );
              expect(prompts).toHaveBeenCalledWith(
                viewUrlPrompt,
                LIFFAddOperation.cancelOption
              );
            });

            afterAll(() => {
              prompts.mockReset();
            });
          });

          describe('and view URL is not empty', () => {
            const viewUrl = 'https://blahblahblah';

            describe('prompts for view URL', () => {
              const descriptionPrompt = {
                type: 'text',
                name: 'description',
                message: 'View description'
              };

              describe('and user cancel', () => {
                beforeAll(() => {
                  prompts
                    .mockImplementationOnce(() => Promise.resolve({ viewType }))
                    .mockImplementationOnce(() => Promise.resolve({ viewUrl }))
                    .mockImplementationOnce((_, options) => {
                      options.onCancel();
                    });
                  spyOn(
                    LIFFAddOperation.cancelOption,
                    'onCancel'
                  ).mockResolvedValue({});
                });

                it('call onCancel', async () => {
                  await expect(
                    LIFFAddOperation.run().catch(_ => {})
                  ).resolves.toEqual();
                  expect(prompts).toHaveBeenCalledWith(
                    viewTypePrompt,
                    LIFFAddOperation.cancelOption
                  );
                  expect(prompts).toHaveBeenCalledWith(
                    viewUrlPrompt,
                    LIFFAddOperation.cancelOption
                  );
                  expect(prompts).toHaveBeenCalledWith(
                    descriptionPrompt,
                    LIFFAddOperation.cancelOption
                  );
                  expect(
                    LIFFAddOperation.cancelOption.onCancel
                  ).toHaveBeenCalled();
                });

                afterAll(() => {
                  LIFFAddOperation.cancelOption.onCancel.mockRestore();
                  prompts.mockReset();
                });
              });

              describe('and view description is empty', () => {
                beforeAll(() => {
                  prompts
                    .mockResolvedValueOnce({ viewType })
                    .mockResolvedValueOnce({ viewUrl })
                    .mockResolvedValueOnce({ description: '' });
                });

                it('resolves false', async () => {
                  await expect(LIFFAddOperation.run()).resolves.toEqual(false);
                  expect(prompts).toHaveBeenCalledWith(
                    viewTypePrompt,
                    LIFFAddOperation.cancelOption
                  );
                  expect(prompts).toHaveBeenCalledWith(
                    viewUrlPrompt,
                    LIFFAddOperation.cancelOption
                  );
                  expect(prompts).toHaveBeenCalledWith(
                    descriptionPrompt,
                    LIFFAddOperation.cancelOption
                  );
                });

                afterAll(() => {
                  prompts.mockReset();
                });
              });

              describe('and view description is not empty', () => {
                const description = 'mock view description';

                describe('prompts for BLE feature', () => {
                  const blePrompt = {
                    type: 'toggle',
                    name: 'ble',
                    message:
                      'Is this LIFF app supports Bluetooth® Low Energy for LINE Things',
                    initial: false,
                    active: 'Yes',
                    inactive: 'No'
                  };

                  describe('and user cancel', () => {
                    beforeAll(() => {
                      prompts
                        .mockImplementationOnce(() =>
                          Promise.resolve({ viewType })
                        )
                        .mockImplementationOnce(() =>
                          Promise.resolve({ viewUrl })
                        )
                        .mockImplementationOnce(() =>
                          Promise.resolve({ description })
                        )
                        .mockImplementationOnce((_, options) => {
                          options.onCancel();
                        });
                      spyOn(
                        LIFFAddOperation.cancelOption,
                        'onCancel'
                      ).mockResolvedValue({});
                    });

                    it('call onCancel', async () => {
                      await expect(
                        LIFFAddOperation.run().catch(_ => {})
                      ).resolves.toEqual();
                      expect(prompts).toHaveBeenCalledTimes(4);
                      expect(prompts).toHaveBeenCalledWith(
                        viewTypePrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(prompts).toHaveBeenCalledWith(
                        viewUrlPrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(prompts).toHaveBeenCalledWith(
                        descriptionPrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(prompts).toHaveBeenCalledWith(
                        blePrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(
                        LIFFAddOperation.cancelOption.onCancel
                      ).toHaveBeenCalled();
                    });

                    afterAll(() => {
                      LIFFAddOperation.cancelOption.onCancel.mockRestore();
                      prompts.mockReset();
                    });
                  });

                  describe('and somehow BLE is undefined', () => {
                    beforeAll(() => {
                      prompts
                        .mockResolvedValueOnce({ viewType })
                        .mockResolvedValueOnce({ viewUrl })
                        .mockResolvedValueOnce({ description })
                        .mockResolvedValueOnce({});
                    });

                    it('return false', async () => {
                      await expect(LIFFAddOperation.run()).resolves.toEqual(
                        false
                      );
                      expect(prompts).toHaveBeenCalledTimes(4);
                      expect(prompts).toHaveBeenCalledWith(
                        viewTypePrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(prompts).toHaveBeenCalledWith(
                        viewUrlPrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(prompts).toHaveBeenCalledWith(
                        descriptionPrompt,
                        LIFFAddOperation.cancelOption
                      );
                      expect(prompts).toHaveBeenCalledWith(
                        blePrompt,
                        LIFFAddOperation.cancelOption
                      );
                    });

                    afterAll(() => {
                      prompts.mockReset();
                    });
                  });

                  describe('and user select BLE', () => {
                    const ble = true;

                    describe('and unable to send add request', () => {
                      const error = new Error('failed to add');

                      beforeAll(() => {
                        prompts
                          .mockResolvedValueOnce({ viewType })
                          .mockResolvedValueOnce({ viewUrl })
                          .mockResolvedValueOnce({ description })
                          .mockResolvedValueOnce({ ble });
                        spyOn(
                          LIFFAddOperation.addRequest,
                          'send'
                        ).mockRejectedValue(error);
                        spyOn(console, 'error').mockReturnValue(undefined);
                      });

                      it('handle error', async () => {
                        await expect(LIFFAddOperation.run()).resolves.toEqual(
                          false
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewTypePrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewUrlPrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          descriptionPrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          blePrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(
                          LIFFAddOperation.addRequest.send
                        ).toHaveBeenCalledWith({
                          view: {
                            type: viewType,
                            url: viewUrl
                          },
                          description,
                          features: {
                            ble
                          }
                        });
                        expect(console.error).toHaveBeenCalledWith(error);
                      });

                      afterAll(() => {
                        LIFFAddOperation.addRequest.send.mockRestore();
                        prompts.mockReset();
                        console.error.mockRestore();
                      });
                    });

                    describe('and able to send add request', () => {
                      const liffId = 'mock returned LIFF ID';
                      const mockAddResponse = {
                        data: { liffId }
                      };

                      beforeAll(() => {
                        prompts
                          .mockResolvedValueOnce({ viewType })
                          .mockResolvedValueOnce({ viewUrl })
                          .mockResolvedValueOnce({ description })
                          .mockResolvedValueOnce({ ble });
                        spyOn(
                          LIFFAddOperation.addRequest,
                          'send'
                        ).mockResolvedValue(mockAddResponse);
                      });

                      it('add LIFF view', async () => {
                        await expect(LIFFAddOperation.run()).resolves.toEqual(
                          true
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewTypePrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewUrlPrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          descriptionPrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          blePrompt,
                          LIFFAddOperation.cancelOption
                        );
                        expect(
                          LIFFAddOperation.addRequest.send
                        ).toHaveBeenCalledWith({
                          view: {
                            type: viewType,
                            url: viewUrl
                          },
                          description,
                          features: {
                            ble
                          }
                        });
                        expect(console.log).toHaveBeenCalledWith(
                          `Added LIFF ID ${liffId.code}`.success
                        );
                      });

                      afterAll(() => {
                        LIFFAddOperation.addRequest.send.mockRestore();
                        prompts.mockReset();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
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
