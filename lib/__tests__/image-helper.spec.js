import fs from 'fs';
import path from 'path';
import { terminal } from 'terminal-kit';
import ImageHelper from '../image-helper';

const { spyOn } = jest;

describe('ImageHelper', () => {
  const chickFacePath = path.resolve(__dirname, '../../assets/chick-face.png');
  const chickHelpsPath = path.resolve(__dirname, '../../assets/chick-helps.png');

  test('All images in assets folder', () => {
    expect(fs.existsSync(chickFacePath)).toEqual(true);
    expect(fs.existsSync(chickHelpsPath)).toEqual(true);
  });

  beforeAll(() => {
    spyOn(console, 'log').mockResolvedValue(undefined);
  });

  describe('when image is drawable', () => {
    beforeAll(() => {
      spyOn(terminal, 'drawImage').mockResolvedValue(undefined);
    });

    it('draw image correctly', async () => {
      const imageName = 'chick-helps';
      await expect(ImageHelper.draw(imageName)).resolves.toEqual(undefined);
      expect(terminal.drawImage.mock.calls[0][0]).toContain(
        `assets/${imageName}.png`
      );
      expect(terminal.drawImage).toHaveBeenCalledWith(chickHelpsPath);
    });

    afterAll(() => {
      terminal.drawImage.mockRestore();
    });
  });

  describe('when image is NOT drawable', () => {
    beforeAll(() => {
      spyOn(terminal, 'drawImage').mockRejectedValueOnce(new Error('failed to draw'));
    });

    it('handles error', async () => {
      const imageName = 'chick-helps';
      await expect(ImageHelper.draw(imageName)).resolves.toEqual(undefined);
      expect(terminal.drawImage.mock.calls[0][0]).toContain(
        `assets/${imageName}.png`
      );
      expect(terminal.drawImage).toHaveBeenCalledWith(chickHelpsPath);
    });

    afterAll(() => {
      terminal.drawImage.mockRestore();
    });
  });

  afterAll(() => {
    console.log.mockRestore();
  });
});
