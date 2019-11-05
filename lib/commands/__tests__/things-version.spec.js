import ThingsCommand from '../things-command';
import ImageHelper from '../../image-helper';

const { spyOn } = jest;

describe('things --version', () => {
  beforeAll(() => {
    spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(process, 'exit').mockReturnValue(undefined);
  });

  describe('when able to display version', () => {
    beforeAll(() => {
      spyOn(ThingsCommand, 'getCommandLineArgs').mockReturnValue({
        operation: null,
        options: {
          version: true
        }
      });
    });

    it('display version', async () => {
      await expect(ThingsCommand.cli());
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(console.log).toHaveBeenCalledWith(ThingsCommand.versionText);
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    afterAll(() => {
      ThingsCommand.getCommandLineArgs.mockRestore();
    });
  });

  afterAll(() => {
    ImageHelper.draw.mockRestore();
    console.log.mockRestore();
    process.exit.mockRestore();
  });
});
