import LINECommand from '../line-command';
import ImageHelper from '../../image-helper';
import LINEInitOperation from '../../operations/line-init-operation';
import LINETokenOperation from '../../operations/line-token-operation';

const { spyOn, mock, unmock } = jest;

describe('line', () => {
  const mockUsage = 'usage';
  let commandLineUsage;

  beforeAll(() => {
    mock('command-line-usage');
    commandLineUsage = require('command-line-usage');
    commandLineUsage.mockImplementation(() => mockUsage);
    spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(process, 'exit').mockReturnValue(undefined);
  });

  beforeEach(() => {
    commandLineUsage.mockClear();
    ImageHelper.draw.mockClear();
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
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(LINEInitOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('line token --help', () => {
    beforeAll(() => {
      spyOn(LINECommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'token',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINECommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(LINETokenOperation.usage);
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
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith([
        ...LINEInitOperation.usage,
        ...LINETokenOperation.usage
      ]);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  afterAll(() => {
    commandLineUsage.mockRestore();
    unmock('command-line-usage');
    ImageHelper.draw.mockRestore();
    console.log.mockRestore();
    process.exit.mockRestore();
  });
});
