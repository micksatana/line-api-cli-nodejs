import colors from 'colors';
import { EOL } from 'os';
import ImageHelper from '../image-helper';
import theme from '../theme';

const { spyOn } = jest;

describe('postinstall', () => {
  beforeAll(() => {
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(colors, 'setTheme').mockReturnValue(undefined);
    spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
  });

  it('run correctly', () => {
    require('../postinstall');
    setTimeout(() => {
      expect(colors.setTheme).toHaveBeenCalledWith(theme);
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-face');
      expect(console.log).toHaveBeenCalledWith(EOL);
    }, 100); // Must set timeout because we cannot await run() in the script
  });

  afterAll(() => {
    ImageHelper.draw.mockRestore();
    colors.setTheme.mockRestore();
    console.log.mockRestore();
  });
});
