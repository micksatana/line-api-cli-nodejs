import LINECommand from '../line-command';
import LINEInitOperation from '../line-init-operation';

const spyOn = jest.spyOn;

describe('line', () => {
  const mockUsage = 'usage';
  let commandLineUsage;

  beforeAll(() => {
    jest.mock('command-line-usage');
    commandLineUsage = require('command-line-usage');
    commandLineUsage.mockImplementation(() => mockUsage);
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(process, 'exit').mockReturnValue(undefined);
  });

  beforeEach(() => {
    commandLineUsage.mockClear();
    console.log.mockClear();
    process.exit.mockClear();
  });

  describe('line init --help', () => {
    beforeAll(() => {
      spyOn(LINECommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'init',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINECommand.cli());
      expect(commandLineUsage).toHaveBeenCalledWith(LINEInitOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('line --help', () => {
    beforeAll(() => {
      spyOn(LINECommand, 'getCommandLineArgs').mockReturnValue({
        operation: undefined,
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINECommand.cli());
      expect(commandLineUsage).toHaveBeenCalledWith([LINEInitOperation.usage]);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  afterAll(() => {
    jest.unmock('command-line-usage');
    console.log.mockRestore();
    process.exit.mockRestore();
  });
});
