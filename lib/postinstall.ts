import { EOL } from 'os';
import colors from 'colors/safe';
import { drawLogo } from './draw';

async function run() {
  await drawLogo();
  console.log(
    EOL +
      colors.green(
        `Run ${colors.cyan(
          'line init'
        )} to initialize project configuration file.`
      ) +
      EOL
  );
}

run();
