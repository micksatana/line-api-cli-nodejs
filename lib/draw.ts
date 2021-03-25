import { EOL } from 'os';
import { resolve } from 'path';
import { terminal } from 'terminal-kit';

export const draw = (imageName) => async () => {
  const imagePath = resolve(__dirname, `../assets/${imageName}.png`);

  console.log(EOL);
  try {
    await terminal.drawImage(imagePath);
  } catch (error) {}
  return;
};

export const drawLogo = draw('chick-face');
export const drawHelp = draw('chick-helps');
