import ThingsCommand from '../things-command';

import ImageHelper from '../../image-helper';
import ThingsAddTrialOperation from '../../operations/things-add-trial-operation';
import ThingsListTrialOperation from '../../operations/things-list-trial-operation';
import ThingsRemoveTrialOperation from '../../operations/things-remove-trial-operation';

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

  describe('things list:trial --help', () => {
    beforeAll(() => {
      spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'list:trial',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(ThingsCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(ThingsListTrialOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('things remove:trial --help', () => {
    beforeAll(() => {
      spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'remove:trial',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(ThingsCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(ThingsRemoveTrialOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('things add:trial --help', () => {
    beforeAll(() => {
      spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'add:trial',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(ThingsCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(ThingsAddTrialOperation.usage);
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
        ...ThingsListTrialOperation.usage,
        ...ThingsAddTrialOperation.usage,
        ...ThingsRemoveTrialOperation.usage
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
