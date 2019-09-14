import colors from 'colors';
import Command from '../command';
import RichmenuCommand from '../richmenu-command';
import ImageHelper from '../../image-helper';
import RichmenuAddOperation from '../../operations/richmenu-add-operation';
import RichmenuLinkOperation from '../../operations/richmenu-link-operation';
import RichmenuListOperation from '../../operations/richmenu-list-operation';
import RichmenuRemoveOperation from '../../operations/richmenu-remove-operation';
import RichmenuSetDefaultOperation from '../../operations/richmenu-set-default-operation';
import RichmenuUnlinkOperation from '../../operations/richmenu-unlink-operation';
import theme from '../../theme';

const { spyOn, mock, unmock } = jest;

describe('RichmenuCommand', () => {
  const mockUsage = 'usage';
  let commandLineArgs;
  let commandLineUsage;

  test('extends Command', () => {
    expect(RichmenuCommand.prototype instanceof Command).toEqual(true);
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
      expect(RichmenuCommand.getCommandLineArgs()).toEqual({
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
        await expect(RichmenuCommand.cli());
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
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'add',
          options: {},
          _unknown: []
        });
        spyOn(RichmenuAddOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(RichmenuAddOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
      });
    });

    describe('when run with default operation', () => {
      beforeAll(() => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'default',
          options: {},
          _unknown: []
        });
        spyOn(RichmenuSetDefaultOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(RichmenuSetDefaultOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
        RichmenuSetDefaultOperation.run.mockRestore();
      });
    });

    describe('when run with list operation', () => {
      beforeAll(() => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'list',
          options: {},
          _unknown: []
        });
        spyOn(RichmenuListOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(RichmenuListOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
        RichmenuListOperation.run.mockRestore();
      });
    });

    describe('when run with link operation', () => {
      beforeAll(() => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'link',
          options: {},
          _unknown: []
        });
        spyOn(RichmenuLinkOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(RichmenuLinkOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
        RichmenuLinkOperation.run.mockRestore();
      });
    });

    describe('when run with unlink operation', () => {
      beforeAll(() => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'unlink',
          options: {},
          _unknown: []
        });
        spyOn(RichmenuUnlinkOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(RichmenuUnlinkOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
        RichmenuUnlinkOperation.run.mockRestore();
      });
    });

    describe('when run with remove operation', () => {
      beforeAll(() => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
          operation: 'remove',
          options: {},
          _unknown: []
        });
        spyOn(RichmenuRemoveOperation, 'run').mockResolvedValue(undefined);
      });

      it('run correctly', async () => {
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(RichmenuRemoveOperation.run).toHaveBeenCalled();
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
        RichmenuRemoveOperation.run.mockRestore();
      });
    });

    describe('when run with unknown operation', () => {
      beforeEach(() => {
        ImageHelper.draw.mockClear();
        console.log.mockClear();
      });

      it('handles unknown operation', async () => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: 'blahblah',
          options: {},
          _unknown: []
        });
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'blahblah'.code}`.warn
        );
      });

      it('handles undefined', async () => {
        spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValueOnce({
          operation: undefined,
          options: {},
          _unknown: []
        });
        await expect(RichmenuCommand.cli()).resolves.toEqual(undefined);
        expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
        expect(console.log).toHaveBeenCalledWith(
          `Unknown operation: ${'undefined'.code}`.warn
        );
      });

      afterAll(() => {
        RichmenuCommand.getCommandLineArgs.mockRestore();
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
