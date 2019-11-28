import colors from 'colors';

import Command from '../command';
import ThingsCommand from '../things-command';

import ImageHelper from '../../image-helper';
import ThingsAddTrialOperation from '../../operations/things-add-trial-operation';
import ThingsGetDeviceOperation from '../../operations/things-get-device-operation';
import ThingsGetDevicesOperation from '../../operations/things-get-devices-operation';
import ThingsGetProductOperation from '../../operations/things-get-product-operation';
import ThingsListTrialOperation from '../../operations/things-list-trial-operation';
import ThingsRegisterScenarioOperation from '../../operations/things-register-scenario-operation';
import ThingsRemoveTrialOperation from '../../operations/things-remove-trial-operation';
import theme from '../../theme';

const { spyOn, mock, unmock } = jest;

describe('ThingsCommand', () => {
  const mockUsage = 'usage';
  let commandLineArgs;
  let commandLineUsage;

  test('extends Command', () => {
    expect(ThingsCommand.prototype instanceof Command).toEqual(true);
  });

  beforeAll(() => {
    spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
    spyOn(console, 'log').mockReturnValue(undefined);

    mock('command-line-usage');
    commandLineUsage = require('command-line-usage');
    commandLineUsage.mockImplementation(() => mockUsage);
  });

  describe('getCommandLineArgs', () => {
    beforeAll(() => {
      colors.setTheme(theme);
      mock('command-line-args');
      commandLineArgs = require('command-line-args');
      commandLineArgs.mockImplementationOnce(() => {
        return {
          operation: 'add'
        };
      });
      commandLineArgs.mockImplementationOnce(() => {
        return {
          help: true
        };
      });

      spyOn(process, 'exit').mockReturnValue(undefined);
    });

    it('display helps', async () => {
      expect(ThingsCommand.getCommandLineArgs()).toEqual({
        operation: 'add',
        options: {
          help: true
        }
      });
      expect(commandLineArgs).toHaveBeenCalledWith(
        [{ name: 'operation', defaultOption: true }],
        { stopAtFirstUnknown: true }
      );
      expect(commandLineArgs).toHaveBeenCalledWith(
        [
          { name: 'help', alias: 'h', type: Boolean },
          { name: 'version', alias: 'v', type: Boolean }
        ],
        { argv: [] }
      );
    });

    afterAll(() => {
      commandLineArgs.mockRestore();
      unmock('command-line-args');
      process.exit.mockRestore();
    });
  });

  describe('cli', () => {
    describe('when unknown error thrown', () => {
      const error = new Error('Unknown error');

      beforeAll(() => {
        spyOn(process, 'exit').mockReturnValue(undefined);
        spyOn(console, 'error').mockReturnValue(undefined);
        spyOn(colors, 'setTheme').mockImplementation(() => {
          throw error;
        });
      });

      it('handles error', async () => {
        await expect(ThingsCommand.cli());
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.error).toHaveBeenCalled();
        expect(process.exit).toHaveBeenCalledWith(1);
      });

      afterAll(() => {
        colors.setTheme.mockRestore();
        console.error.mockRestore();
        process.exit.mockRestore();
      });
    });

    describe('when run with list trial operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'list:trial',
          options: {},
          _unknown: []
        });
        spyOn(ThingsListTrialOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsListTrialOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsListTrialOperation.run.mockRestore();
      });
    });

    describe('when run with remove trial operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'remove:trial',
          options: {},
          _unknown: []
        });
        spyOn(ThingsRemoveTrialOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsRemoveTrialOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsRemoveTrialOperation.run.mockRestore();
      });
    });

    describe('when run with add trial operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'add:trial',
          options: {},
          _unknown: []
        });
        spyOn(ThingsAddTrialOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsAddTrialOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsAddTrialOperation.run.mockRestore();
      });
    });

    describe('when run with get device operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'get:device',
          options: {},
          _unknown: []
        });
        spyOn(ThingsGetDeviceOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsGetDeviceOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsGetDeviceOperation.run.mockRestore();
      });
    });

    describe('when run with get devices operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'get:devices',
          options: {},
          _unknown: []
        });
        spyOn(ThingsGetDevicesOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsGetDevicesOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsGetDevicesOperation.run.mockRestore();
      });
    });

    describe('when run with get product operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'get:product',
          options: {},
          _unknown: []
        });
        spyOn(ThingsGetProductOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsGetProductOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsGetProductOperation.run.mockRestore();
      });
    });

    describe('when run with register scenario operation', () => {
      beforeAll(() => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'register:scenarios',
          options: {},
          _unknown: []
        });
        spyOn(ThingsRegisterScenarioOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ThingsRegisterScenarioOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
        ThingsRegisterScenarioOperation.run.mockRestore();
      });
    });

    describe('when run with unknown operation', () => {
      beforeEach(() => {
        ImageHelper.draw.mockClear();
        console.log.mockClear();
      });

      it('handles unknown operation', async () => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: 'blahblah',
          options: {},
          _unknown: []
        });
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'blahblah'.code}`.warn
        );
      });

      it('handles undefined', async () => {
        spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: undefined,
          options: {},
          _unknown: []
        });
        await expect(ThingsCommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'undefined'.code}`.warn
        );
      });

      afterAll(() => {
        ThingsCommand.getCommandLineArgs.mockRestore();
      });
    });
  });

  afterAll(() => {
    commandLineUsage.mockRestore();
    unmock('command-line-usage');
    ImageHelper.draw.mockRestore();
    console.log.mockRestore();
  });
});
