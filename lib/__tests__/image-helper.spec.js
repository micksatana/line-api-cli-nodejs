import fs from 'fs';
import path from 'path';
import { terminal } from 'terminal-kit';
import ImageHelper from '../image-helper';

const { spyOn } = jest;

describe('ImageHelper', () => {
  test('All images in assets folder', () => {
    expect(
      fs.existsSync(path.resolve(__dirname, '../../assets/chick-face.png'))
    ).toEqual(true);
    expect(
      fs.existsSync(path.resolve(__dirname, '../../assets/chick-helps.png'))
    ).toEqual(true);
  });

  beforeAll(() => {
    spyOn(terminal, 'drawImage').mockResolvedValue(undefined);
    spyOn(console, 'log').mockResolvedValue(undefined);
  });

  beforeEach(() => {
    terminal.drawImage.mockClear();
  });

  it('draw image correctly', async () => {
    const imageName = 'chick-helps';
    await expect(ImageHelper.draw(imageName));
    expect(terminal.drawImage.mock.calls[0][0]).toContain(
      `assets/${imageName}.png`
    );
  });

  afterAll(() => {
    terminal.drawImage.mockRestore();
    console.log.mockRestore();
  });
});
