import { CommandLineOptions } from 'command-line-args';
import { Section } from 'command-line-usage';
import { TokenCommandLineOptions } from './token';
import { loadDirs } from './load-dirs';

export interface LINECommand<T> {
  command: (option: T) => void;
  print: () => void;
  usage: Section[];
}

export interface LINECommands {
  [name: string]: LINECommand<CommandLineOptions>;
  init: LINECommand<CommandLineOptions>;
  token: LINECommand<TokenCommandLineOptions>;
}

export const commands = loadDirs<LINECommands>(__dirname);
