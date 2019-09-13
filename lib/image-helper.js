import path from 'path';
import { terminal } from 'terminal-kit';
import { EOL } from 'os';

export default class ImageHelper {
  static async draw(imageName) {
    const imagePath = path.resolve(__dirname, `../assets/${imageName}.png`);

    console.log(EOL);
    try {
      await terminal.drawImage(imagePath);
    } catch (error) { }
    return;
  }
}
