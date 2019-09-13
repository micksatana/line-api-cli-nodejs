import colors from 'colors';
import Command from '../command';
import LINECommand from '../line-command';
import ImageHelper from '../../image-helper';
import theme from '../../theme';
import LINETokenOperation from '../../operations/line-token-operation';
import LINEInitOperation from '../../operations/line-init-operation';
const { spyOn, mock, unmock } = jest;

describe('LINECommand', () => {
  const mockUsage = 'usage';
  let commandLineArgs;
  let commandLineUsage;

  test('extends Command', () => {
    expect(LINECommand.prototype instanceof Command).toEqual(true);
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
          operation: 'init'
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
      expect(LINECommand.getCommandLineArgs()).toEqual({
        operation: 'init',
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
          { name: 'version', alias: 'v', type: Boolean },
          { name: 'issue', type: Boolean },
          { name: 'revoke', type: Boolean }
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
        await expect(LINECommand.cli());
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

    describe('when run with init operation', () => {
      beforeAll(() => {
        spyOn(LINECommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'init',
          options: {},
          _unknown: []
        });
        spyOn(LINEInitOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(LINECommand.cli()).resolves.toEqual(undefined);
        expect(LINEInitOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        LINECommand.getCommandLineArgs.mockRestore();
      });
    });

    describe('when run with token operation', () => {
      beforeAll(() => {
        spyOn(LINECommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'token',
          options: {},
          _unknown: []
        });
        spyOn(LINETokenOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(LINECommand.cli()).resolves.toEqual(undefined);
        expect(LINETokenOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        LINECommand.getCommandLineArgs.mockRestore();
      });
    });

    describe('when run with unknown operation', () => {
      beforeEach(() => {
        ImageHelper.draw.mockClear();
        console.log.mockClear();
      });

      it('handles unknown operation', async () => {
        spyOn(LINECommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: 'blahblah',
          options: {},
          _unknown: []
        });
        await expect(LINECommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'blahblah'.code}`.warn
        );
      });

      it('handles undefined', async () => {
        spyOn(LINECommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: undefined,
          options: {},
          _unknown: []
        });
        await expect(LINECommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'undefined'.code}`.warn
        );
      });

      afterAll(() => {
        LINECommand.getCommandLineArgs.mockRestore();
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
