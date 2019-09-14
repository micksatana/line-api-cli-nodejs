import LIFFCommand from '../liff-command';
import ImageHelper from '../../image-helper';

const { spyOn } = jest;

describe('liff --version', () => {
  beforeAll(() => {
    spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(process, 'exit').mockReturnValue(undefined);
  });

  describe('when able to display version', () => {
    beforeAll(() => {
      spyOn(LIFFCommand, 'getCommandLineArgs').mockReturnValue({
        operation: null,
        options: {
          version: true
        }
      });
    });

    it('display version', async () => {
      await expect(LIFFCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(console.log).toHaveBeenCalledWith(LIFFCommand.versionText);
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    afterAll(() => {
      LIFFCommand.getCommandLineArgs.mockRestore();
    });
  });

  afterAll(() => {
    ImageHelper.draw.mockRestore();
    console.log.mockRestore();
    process.exit.mockRestore();
  });
});
