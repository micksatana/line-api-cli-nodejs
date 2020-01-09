#!/usr/bin/env node
import colors from 'colors';
import Operation from '../operations/operation';
import theme from '../theme';

colors.setTheme(theme);

if (Operation.config) {
  const LINETvCommand = require('../commands/linetv-command').default;

  LINETvCommand.cli();
}
