import colors from 'colors';
import LINECommand from '../line-command';
import theme from '../../theme';

const { spyOn, mock, unmock } = jest;

describe('LINECommand', () => {
  const mockUsage = 'usage';
  let commandLineArgs;
  let commandLineUsage;

  beforeAll(() => {
    spyOn(console, 'log').mockReturnValue(undefined);

    mock('command-line-usage');
    commandLineUsage = require('command-line-usage');
    commandLineUsage.mockImplementation(() => mockUsage);
  });

  test('versionText', () => {
    expect(LINECommand.versionText).toContain(
      require('../../../package.json').version
    );
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
          { name: 'save', type: Boolean }
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
        expect(console.error).toHaveBeenCalled();
        expect(process.exit).toHaveBeenCalledWith(1);
      });

      afterAll(() => {
        colors.setTheme.mockRestore();
        console.error.mockRestore();
        process.exit.mockRestore();
      });
    });
  });

  afterAll(() => {
    commandLineUsage.mockRestore();
    unmock('command-line-usage');
    console.log.mockRestore();
  });
});
