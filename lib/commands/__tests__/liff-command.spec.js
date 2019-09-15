import colors from 'colors';
import Command from '../command';
import LIFFCommand from '../liff-command';
import ImageHelper from '../../image-helper';
import LIFFAddOperation from '../../operations/liff-add-operation';
import LIFFListOperation from '../../operations/liff-list-operation';
import LIFFRemoveOperation from '../../operations/liff-remove-operation';
import theme from '../../theme';

const { spyOn, mock, unmock } = jest;

describe('LIFFCommand', () => {
  const mockUsage = 'usage';
  let commandLineArgs;
  let commandLineUsage;

  test('extends Command', () => {
    expect(LIFFCommand.prototype instanceof Command).toEqual(true);
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
      expect(LIFFCommand.getCommandLineArgs()).toEqual({
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
        await expect(LIFFCommand.cli());
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

    describe('when run with add operation', () => {
      beforeAll(() => {
        spyOn(LIFFCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'add',
          options: {},
          _unknown: []
        });
        spyOn(LIFFAddOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(LIFFCommand.cli()).resolves.toEqual(undefined);
        expect(LIFFAddOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        LIFFCommand.getCommandLineArgs.mockRestore();
        LIFFAddOperation.run.mockRestore();
      });
    });

    describe('when run with list operation', () => {
      beforeAll(() => {
        spyOn(LIFFCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'list',
          options: {},
          _unknown: []
        });
        spyOn(LIFFListOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(LIFFCommand.cli()).resolves.toEqual(undefined);
        expect(LIFFListOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        LIFFCommand.getCommandLineArgs.mockRestore();
        LIFFListOperation.run.mockRestore();
      });
    });

    describe('when run with remove operation', () => {
      beforeAll(() => {
        spyOn(LIFFCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'remove',
          options: {},
          _unknown: []
        });
        spyOn(LIFFRemoveOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(LIFFCommand.cli()).resolves.toEqual(undefined);
        expect(LIFFRemoveOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        LIFFCommand.getCommandLineArgs.mockRestore();
        LIFFRemoveOperation.run.mockRestore();
      });
    });
  
    describe('when run with unknown operation', () => {
      beforeEach(() => {
        ImageHelper.draw.mockClear();
        console.log.mockClear();
      });

      it('handles unknown operation', async () => {
        spyOn(LIFFCommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: 'blahblah',
          options: {},
          _unknown: []
        });
        await expect(LIFFCommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'blahblah'.code}`.warn
        );
      });

      it('handles undefined', async () => {
        spyOn(LIFFCommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: undefined,
          options: {},
          _unknown: []
        });
        await expect(LIFFCommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'undefined'.code}`.warn
        );
      });

      afterAll(() => {
        LIFFCommand.getCommandLineArgs.mockRestore();
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
