import commandLineUsage, { Section } from 'command-line-usage';

export const printUsage = (usage: Section[]) => () =>
  console.log(commandLineUsage(usage));
