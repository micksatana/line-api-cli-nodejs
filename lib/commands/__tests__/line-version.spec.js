import LINECommand from '../line-command';
import ImageHelper from '../../image-helper';

const { spyOn } = jest;

describe('line --version', () => {
  beforeAll(() => {
    spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(process, 'exit').mockReturnValue(undefined);
  });

  describe('when able to display version', () => {
    beforeAll(() => {
      spyOn(LINECommand, 'getCommandLineArgs').mockReturnValue({
        operation: null,
        options: {
          version: true
        }
      });
    });

    it('display version', async () => {
      await expect(LINECommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(console.log).toHaveBeenCalledWith(LINECommand.versionText);
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    afterAll(() => {
      LINECommand.getCommandLineArgs.mockRestore();
    });
  });

  afterAll(() => {
    ImageHelper.draw.mockRestore();
    console.log.mockRestore();
    process.exit.mockRestore();
  });
});
