import commandLineArgs from 'command-line-args';
import { commands } from './commands';
import { drawHelp } from '../draw';
import { optionDefinitions } from './option-definitions';
import { version } from '../version';

export const cli = async () => {
  try {
    const { command, _unknown } = commandLineArgs(
      [{ name: 'command', defaultOption: true }],
      { stopAtFirstUnknown: true }
    );
    const argv = _unknown || [];
    const options = commandLineArgs(optionDefinitions, { argv });

    const line = commands();

    if (options.help) {
      if (command) {
        line[command].print();
      } else {
        for (const [_, cmd] of Object.entries(line)) {
          cmd.print();
        }
      }
      process.exit(0);
    }

    if (options.version) {
      console.log(`LINE API CLIs v${version}`);
      process.exit(0);
    }

    await line[command].command(options);

    return;
  } catch (error) {
    await drawHelp();
    console.error(error);
    process.exit(1);
  }
};
