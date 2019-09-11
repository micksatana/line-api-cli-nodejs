import colors from 'colors';
import { EOL } from 'os';

import ImageHelper from './image-helper';
import theme from './theme';

async function run() {
  colors.setTheme(theme);

  await ImageHelper.draw('chick-face');

  console.log(
    EOL + `Run ${'line init'.code} to initialize project configuration file.`.help + EOL
  );
}

run();
