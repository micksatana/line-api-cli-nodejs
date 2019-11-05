#!/usr/bin/env node
import colors from 'colors';
import Operation from '../operations/operation';
import theme from '../theme';

colors.setTheme(theme);

if (Operation.config) {
  const ThingsCommand = require('../commands/things-command').default;

  ThingsCommand.cli();
}
