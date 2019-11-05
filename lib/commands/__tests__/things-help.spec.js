import ThingsCommand from '../things-command';

import ImageHelper from '../../image-helper';
import ThingsGetTrialOperation from '../../operations/things-get-trial-operation';

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

  describe('things get:trial --help', () => {
    beforeAll(() => {
      spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'get:trial',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(ThingsCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(ThingsGetTrialOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('things --help', () => {
    beforeAll(() => {
      spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
        operation: undefined,
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(ThingsCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith([
        ...ThingsGetTrialOperation.usage
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
