import RichmenuCommand from '../richmenu-command';
import ImageHelper from '../../image-helper';
import RichmenuAddOperation from '../../operations/richmenu-add-operation';
import RichmenuLinkOperation from '../../operations/richmenu-link-operation';
import RichmenuListOperation from '../../operations/richmenu-list-operation';
import RichmenuRemoveOperation from '../../operations/richmenu-remove-operation';
import RichmenuSetDefaultOperation from '../../operations/richmenu-set-default-operation';
import RichmenuUnlinkOperation from '../../operations/richmenu-unlink-operation';

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

  describe('richmenu add --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'add',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(RichmenuAddOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('richmenu default --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'default',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(RichmenuSetDefaultOperation.usage);
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('richmenu list --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'list',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        RichmenuListOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('richmenu link --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'link',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        RichmenuLinkOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('richmenu unlink --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'unlink',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        RichmenuUnlinkOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('richmenu remove --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: 'remove',
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith(
        RichmenuRemoveOperation.usage
      );
      expect(console.log).toHaveBeenCalledWith(mockUsage);
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('richmenu --help', () => {
    beforeAll(() => {
      spyOn(RichmenuCommand, 'getCommandLineArgs').mockReturnValue({
        operation: undefined,
        options: {
          help: true
        },
        _unknown: []
      });
    });

    it('display helps', async () => {
      await expect(RichmenuCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(commandLineUsage).toHaveBeenCalledWith([
        ...RichmenuAddOperation.usage,
        ...RichmenuListOperation.usage,
        ...RichmenuRemoveOperation.usage,
        ...RichmenuSetDefaultOperation.usage,
        ...RichmenuLinkOperation.usage,
        ...RichmenuUnlinkOperation.usage
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
