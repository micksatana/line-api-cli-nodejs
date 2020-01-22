import LINETvCommand from '../linetv-command';

import ImageHelper from '../../image-helper';
import LINETvListModulesOperation from '../../operations/linetv-list-modules-operation';
import LINETvGetSpotlightOperation from '../../operations/linetv-get-sportlight-operation';
import LINETvListCategoryOperation from '../../operations/linetv-list-category-operation';
import LINETvGetCategoryOperation from '../../operations/linetv-get-category-operation';
import LINETvRankingOperation from '../../operations/linetv-ranking-operation';
import LINETvSearchOperation from '../../operations/linetv-search-operation';
import LINETvListStationOperation from '../../operations/linetv-list-station-operation';
import LINETvGetStationOperation from '../../operations/linetv-get-station-operation';

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

  describe('linetv list:modules --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'list:modules',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvListModulesOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv get:spotlight --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'get:spotlight',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvGetSpotlightOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv list:category --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'list:category',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvListCategoryOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv get:category --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'get:category',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvGetCategoryOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

    describe('linetv get:category --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'get:category',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvGetCategoryOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv ranking --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'ranking',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvRankingOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv search --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'search',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvSearchOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv list:station --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'list:station',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvListStationOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv get:station --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'get:station',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        LINETvGetStationOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('linetv --help', () => {
    beforeAll(() => {
      spyOn(LINETvCommand, 'getCommandLineArgs').mockReturnValue({
        operation: undefined,
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(LINETvCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith([
        ...LINETvListModulesOperation.usage,
        ...LINETvGetSpotlightOperation.usage,
        ...LINETvListCategoryOperation.usage,
        ...LINETvGetCategoryOperation.usage,
        ...LINETvRankingOperation.usage,
        ...LINETvSearchOperation.usage,
        ...LINETvListStationOperation.usage,
        ...LINETvGetStationOperation.usage
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
