#!/usr/bin/env node
import colors from 'colors';
import Operation from '../operations/operation';
import theme from '../theme';

colors.setTheme(theme);

if (Operation.config) {
  const LIFFCommand = require('../commands/liff-command').default;

  LIFFCommand.cli();
}
