import 'console.table';
import Operation from '../operation';
import LIFFUpdateOperation from '../liff-update-operation';

const { spyOn, mock, unmock } = jest;

describe('liff update', () => {
  it('extends Operation', () => {
    expect(LIFFUpdateOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LIFFUpdateOperation.usage).toEqual([
      {
        header: 'Update a LIFF view'.help,
        content: `liff update`.code
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LIFFUpdateOperation.run).toEqual('function');
  });

  describe('when config is invalid', () => {
    beforeAll(() => {
      spyOn(LIFFUpdateOperation, 'validateConfig').mockReturnValue(false);
    });

    it('handles correctly', async () => {
      await expect(LIFFUpdateOperation.run()).resolves.toEqual(false);
    });

    afterAll(() => {
      LIFFUpdateOperation.validateConfig.mockRestore();
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
      spyOn(LIFFUpdateOperation, 'config', 'get').mockReturnValue(mockConfig);
      spyOn(LIFFUpdateOperation, 'validateConfig').mockReturnValue(true);
      mock('prompts');
      prompts = require('prompts');
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    describe('when failed to list LIFF apps', () => {
      const error = new Error('list failed');

      beforeAll(() => {
        spyOn(LIFFUpdateOperation.listRequest, 'send').mockRejectedValue(error);
        spyOn(console, 'error').mockReturnValue(undefined);
      });

      it('handles error', async () => {
        await expect(LIFFUpdateOperation.run()).resolves.toEqual(false);
        expect(console.error).toHaveBeenCalledWith(error);
      });

      afterAll(() => {
        LIFFUpdateOperation.listRequest.send.mockRestore();
        console.error.mockRestore();
      });
    });

    describe('when no LIFF app data', () => {
      beforeAll(() => {
        spyOn(LIFFUpdateOperation.listRequest, 'send')
          .mockResolvedValueOnce({
            data: {
              apps: []
            }
          })
          .mockResolvedValueOnce({
            data: {}
          });
      });

      it('handles error', async () => {
        // Test empty apps
        await expect(LIFFUpdateOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
        console.log.mockClear();
        // Test no apps
        await expect(LIFFUpdateOperation.run()).resolves.toEqual(true);
        expect(console.log).toHaveBeenCalledWith('LIFF app not found'.info);
      });

      afterAll(() => {
        LIFFUpdateOperation.listRequest.send.mockRestore();
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
      const mockResponse = {
        data: {
          apps
        }
      };
      const appChoices = apps.map(app => {
        return {
          title: `${app.view.type} ${app.view.url} [${app.liffId}]`,
          description: app.description,
          value: app
        };
      });
      const appsPrompt = {
        type: 'select',
        name: 'app',
        message: 'Select a LIFF app to be updated',
        choices: appChoices
      };

      describe('and somehow app from prompt is undefined', () => {
        beforeAll(() => {
          spyOn(LIFFUpdateOperation.listRequest, 'send').mockResolvedValue(
            mockResponse
          );
          mock('prompts');
          prompts = require('prompts');
          prompts.mockResolvedValueOnce({});
        });

        it('return false', async () => {
          await expect(LIFFUpdateOperation.run()).resolves.toEqual(false);
        });

        afterAll(() => {
          LIFFUpdateOperation.listRequest.send.mockRestore();
          prompts.mockRestore();
          unmock('prompts');
        });
      });

      describe('and selected app with BLE', () => {
        beforeAll(() => {
          spyOn(LIFFUpdateOperation.listRequest, 'send').mockResolvedValue(
            mockResponse
          );
          mock('prompts');
          prompts = require('prompts');
          prompts
            .mockResolvedValueOnce({
              app: {
                liffId: 'zzzz',
                view: {
                  type: 'compact',
                  url: 'https://www.intocode.io'
                },
                description: 'With BLE true',
                features: {
                  ble: true
                }
              }
            })
            .mockResolvedValueOnce({ viewType: 'x' })
            .mockResolvedValueOnce({ viewUrl: 'x' })
            .mockResolvedValueOnce({ description: 'x' })
            .mockResolvedValueOnce({ ble: false });
          spyOn(LIFFUpdateOperation.updateRequest, 'send').mockResolvedValue(
            {}
          );
        });

        it('return true', async () => {
          await expect(LIFFUpdateOperation.run()).resolves.toEqual(true);
        });

        afterAll(() => {
          LIFFUpdateOperation.listRequest.send.mockRestore();
          prompts.mockRestore();
          unmock('prompts');
        });
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
          ],
          initial: 2
        };
        const app = appChoices[1].value;

        beforeAll(() => {
          spyOn(LIFFUpdateOperation.listRequest, 'send').mockResolvedValue(
            mockResponse
          );
          spyOn(LIFFUpdateOperation.updateRequest, 'send').mockResolvedValue(
            {}
          );
          mock('prompts');
          prompts = require('prompts');
        });

        beforeEach(() => {
          LIFFUpdateOperation.listRequest.send.mockClear();
          LIFFUpdateOperation.updateRequest.send.mockClear();
        });

        describe('and user cancel', () => {
          beforeAll(() => {
            prompts
              .mockImplementationOnce(() => Promise.resolve({ app }))
              .mockImplementationOnce((_, options) => {
                options.onCancel();
              });
            spyOn(
              LIFFUpdateOperation.cancelOption,
              'onCancel'
            ).mockResolvedValue({});
          });

          it('call onCancel', async () => {
            await expect(
              LIFFUpdateOperation.run().catch(_ => {})
            ).resolves.toEqual();
            expect(LIFFUpdateOperation.listRequest.send).toHaveBeenCalled();
            expect(prompts).toHaveBeenCalledWith(
              appsPrompt,
              LIFFUpdateOperation.cancelOption
            );
            expect(prompts).toHaveBeenCalledWith(
              viewTypePrompt,
              LIFFUpdateOperation.cancelOption
            );
            expect(
              LIFFUpdateOperation.cancelOption.onCancel
            ).toHaveBeenCalled();
          });

          afterAll(() => {
            LIFFUpdateOperation.cancelOption.onCancel.mockRestore();
            prompts.mockReset();
          });
        });

        describe('and somehow view type is empty', () => {
          beforeAll(() => {
            prompts
              .mockResolvedValueOnce({ app })
              .mockResolvedValueOnce({ viewType: '' });
          });

          it('resolves false', async () => {
            await expect(LIFFUpdateOperation.run()).resolves.toEqual(false);
            expect(prompts).toHaveBeenCalledWith(
              appsPrompt,
              LIFFUpdateOperation.cancelOption
            );
            expect(prompts).toHaveBeenCalledWith(
              viewTypePrompt,
              LIFFUpdateOperation.cancelOption
            );
          });

          afterAll(() => {
            prompts.mockReset();
          });
        });

        describe('and user select a view type', () => {
          const viewType = 'full';

          describe('prompts for view URL', () => {
            const viewUrlPrompt = {
              type: 'text',
              name: 'viewUrl',
              message: 'View URL',
              initial: app.view.url
            };

            describe('and user cancel', () => {
              beforeAll(() => {
                prompts
                  .mockImplementationOnce(() => Promise.resolve({ app }))
                  .mockImplementationOnce(() => Promise.resolve({ viewType }))
                  .mockImplementationOnce((_, options) => {
                    options.onCancel();
                  });
                spyOn(
                  LIFFUpdateOperation.cancelOption,
                  'onCancel'
                ).mockResolvedValue({});
              });

              it('call onCancel', async () => {
                await expect(
                  LIFFUpdateOperation.run().catch(_ => {})
                ).resolves.toEqual();
                expect(prompts).toHaveBeenCalledTimes(3);
                expect(prompts).toHaveBeenCalledWith(
                  appsPrompt,
                  LIFFUpdateOperation.cancelOption
                );
                expect(prompts).toHaveBeenCalledWith(
                  viewTypePrompt,
                  LIFFUpdateOperation.cancelOption
                );
                expect(prompts).toHaveBeenCalledWith(
                  viewUrlPrompt,
                  LIFFUpdateOperation.cancelOption
                );
                expect(
                  LIFFUpdateOperation.cancelOption.onCancel
                ).toHaveBeenCalled();
              });

              afterAll(() => {
                LIFFUpdateOperation.cancelOption.onCancel.mockRestore();
                prompts.mockReset();
              });
            });

            describe('and view URL is empty', () => {
              beforeAll(() => {
                prompts
                  .mockResolvedValueOnce({ app })
                  .mockResolvedValueOnce({ viewType })
                  .mockResolvedValueOnce({ viewUrl: '' });
              });

              it('resolves false', async () => {
                await expect(LIFFUpdateOperation.run()).resolves.toEqual(false);
                expect(prompts).toHaveBeenCalledTimes(3);
                expect(prompts).toHaveBeenCalledWith(
                  appsPrompt,
                  LIFFUpdateOperation.cancelOption
                );
                expect(prompts).toHaveBeenCalledWith(
                  viewTypePrompt,
                  LIFFUpdateOperation.cancelOption
                );
                expect(prompts).toHaveBeenCalledWith(
                  viewUrlPrompt,
                  LIFFUpdateOperation.cancelOption
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
                  message: 'View description',
                  initial: app.description
                };

                describe('and user cancel', () => {
                  beforeAll(() => {
                    prompts
                      .mockImplementationOnce(() => Promise.resolve({ app }))
                      .mockImplementationOnce(() =>
                        Promise.resolve({ viewType })
                      )
                      .mockImplementationOnce(() =>
                        Promise.resolve({ viewUrl })
                      )
                      .mockImplementationOnce((_, options) => {
                        options.onCancel();
                      });
                    spyOn(
                      LIFFUpdateOperation.cancelOption,
                      'onCancel'
                    ).mockResolvedValue({});
                  });

                  it('call onCancel', async () => {
                    await expect(
                      LIFFUpdateOperation.run().catch(_ => {})
                    ).resolves.toEqual();
                    expect(prompts).toHaveBeenCalledWith(
                      appsPrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      viewTypePrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      viewUrlPrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      descriptionPrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(
                      LIFFUpdateOperation.cancelOption.onCancel
                    ).toHaveBeenCalled();
                  });

                  afterAll(() => {
                    LIFFUpdateOperation.cancelOption.onCancel.mockRestore();
                    prompts.mockReset();
                  });
                });

                describe('and view description is empty', () => {
                  beforeAll(() => {
                    prompts
                      .mockResolvedValueOnce({ app })
                      .mockResolvedValueOnce({ viewType })
                      .mockResolvedValueOnce({ viewUrl })
                      .mockResolvedValueOnce({ description: '' });
                  });

                  it('resolves false', async () => {
                    await expect(LIFFUpdateOperation.run()).resolves.toEqual(
                      false
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      appsPrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      viewTypePrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      viewUrlPrompt,
                      LIFFUpdateOperation.cancelOption
                    );
                    expect(prompts).toHaveBeenCalledWith(
                      descriptionPrompt,
                      LIFFUpdateOperation.cancelOption
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
                            Promise.resolve({ app })
                          )
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
                          LIFFUpdateOperation.cancelOption,
                          'onCancel'
                        ).mockResolvedValue({});
                      });

                      it('call onCancel', async () => {
                        await expect(
                          LIFFUpdateOperation.run().catch(_ => {})
                        ).resolves.toEqual();
                        expect(prompts).toHaveBeenCalledTimes(5);
                        expect(prompts).toHaveBeenCalledWith(
                          appsPrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewTypePrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewUrlPrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          descriptionPrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          blePrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(
                          LIFFUpdateOperation.cancelOption.onCancel
                        ).toHaveBeenCalled();
                      });

                      afterAll(() => {
                        LIFFUpdateOperation.cancelOption.onCancel.mockRestore();
                        prompts.mockReset();
                      });
                    });

                    describe('and somehow BLE is undefined', () => {
                      beforeAll(() => {
                        prompts
                          .mockResolvedValueOnce({ app })
                          .mockResolvedValueOnce({ viewType })
                          .mockResolvedValueOnce({ viewUrl })
                          .mockResolvedValueOnce({ description })
                          .mockResolvedValueOnce({});
                      });

                      it('return false', async () => {
                        await expect(
                          LIFFUpdateOperation.run()
                        ).resolves.toEqual(false);
                        expect(prompts).toHaveBeenCalledTimes(5);
                        expect(prompts).toHaveBeenCalledWith(
                          appsPrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewTypePrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          viewUrlPrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          descriptionPrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                        expect(prompts).toHaveBeenCalledWith(
                          blePrompt,
                          LIFFUpdateOperation.cancelOption
                        );
                      });

                      afterAll(() => {
                        prompts.mockReset();
                      });
                    });

                    describe('and user select BLE', () => {
                      const ble = true;

                      describe('and unable to send update request', () => {
                        const error = new Error('failed to update');

                        beforeAll(() => {
                          prompts
                            .mockResolvedValueOnce({ app })
                            .mockResolvedValueOnce({ viewType })
                            .mockResolvedValueOnce({ viewUrl })
                            .mockResolvedValueOnce({ description })
                            .mockResolvedValueOnce({ ble });
                          spyOn(
                            LIFFUpdateOperation.updateRequest,
                            'send'
                          ).mockRejectedValue(error);
                          spyOn(console, 'error').mockReturnValue(undefined);
                        });

                        it('handle error', async () => {
                          await expect(
                            LIFFUpdateOperation.run()
                          ).resolves.toEqual(false);
                          expect(prompts).toHaveBeenCalledWith(
                            appsPrompt,
                            LIFFUpdateOperation.cancelOption
                          );
                          expect(prompts).toHaveBeenCalledWith(
                            viewTypePrompt,
                            LIFFUpdateOperation.cancelOption
                          );
                          expect(prompts).toHaveBeenCalledWith(
                            viewUrlPrompt,
                            LIFFUpdateOperation.cancelOption
                          );
                          expect(prompts).toHaveBeenCalledWith(
                            descriptionPrompt,
                            LIFFUpdateOperation.cancelOption
                          );
                          expect(prompts).toHaveBeenCalledWith(
                            blePrompt,
                            LIFFUpdateOperation.cancelOption
                          );
                          expect(
                            LIFFUpdateOperation.updateRequest.send
                          ).toHaveBeenCalledWith(app.liffId, {
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
                          LIFFUpdateOperation.updateRequest.send.mockRestore();
                          prompts.mockReset();
                          console.error.mockRestore();
                        });
                      });

                      describe('and able to send update request', () => {
                        describe('when BLE is true', () => {
                          let data;

                          beforeAll(() => {
                            prompts
                              .mockResolvedValueOnce({ app })
                              .mockResolvedValueOnce({ viewType })
                              .mockResolvedValueOnce({ viewUrl })
                              .mockResolvedValueOnce({ description })
                              .mockResolvedValueOnce({ ble });
                            spyOn(
                              LIFFUpdateOperation.updateRequest,
                              'send'
                            ).mockResolvedValue({});
                            spyOn(console, 'table').mockReturnValue(undefined);
                            data = {
                              view: {
                                type: viewType,
                                url: viewUrl
                              },
                              description,
                              features: {
                                ble
                              }
                            };
                          });

                          it('update LIFF view', async () => {
                            await expect(
                              LIFFUpdateOperation.run()
                            ).resolves.toEqual(true);

                            expect(
                              LIFFUpdateOperation.updateRequest.send
                            ).toHaveBeenCalledWith(app.liffId, data);

                            const row = {};

                            row['LIFF app ID'.success] = app.liffId;
                            row['Type'.success] = data.view.type;
                            row['URL'.success] = data.view.url;
                            row['Description'.success] = data.description;
                            row['BLE'.success] = '\u2713'; // true
                            expect(console.table).toHaveBeenCalledWith([row]);
                          });

                          afterAll(() => {
                            console.table.mockRestore();
                            LIFFUpdateOperation.updateRequest.send.mockRestore();
                            prompts.mockReset();
                          });
                        });

                        describe('when BLE is false', () => {
                          let data;

                          beforeAll(() => {
                            prompts
                              .mockResolvedValueOnce({ app })
                              .mockResolvedValueOnce({ viewType })
                              .mockResolvedValueOnce({ viewUrl })
                              .mockResolvedValueOnce({ description })
                              .mockResolvedValueOnce({ ble: false });
                            spyOn(
                              LIFFUpdateOperation.updateRequest,
                              'send'
                            ).mockResolvedValue({});
                            spyOn(console, 'table').mockReturnValue(undefined);
                            data = {
                              view: {
                                type: viewType,
                                url: viewUrl
                              },
                              description,
                              features: {
                                ble: false
                              }
                            };
                          });

                          it('update LIFF view', async () => {
                            await expect(
                              LIFFUpdateOperation.run()
                            ).resolves.toEqual(true);

                            expect(
                              LIFFUpdateOperation.updateRequest.send
                            ).toHaveBeenCalledWith(app.liffId, data);

                            const row = {};

                            row['LIFF app ID'.success] = app.liffId;
                            row['Type'.success] = data.view.type;
                            row['URL'.success] = data.view.url;
                            row['Description'.success] = data.description;
                            row['BLE'.success] = '\u2715'; // false
                            expect(console.table).toHaveBeenCalledWith([row]);
                          });

                          afterAll(() => {
                            console.table.mockRestore();
                            LIFFUpdateOperation.updateRequest.send.mockRestore();
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
          LIFFUpdateOperation.listRequest.send.mockRestore();
          LIFFUpdateOperation.updateRequest.send.mockRestore();
        });
      });
    });

    afterAll(() => {
      LIFFUpdateOperation.config.mockRestore();
      LIFFUpdateOperation.validateConfig.mockRestore();
      console.log.mockRestore();
      prompts.mockRestore();
      unmock('prompts');
    });
  });
});
