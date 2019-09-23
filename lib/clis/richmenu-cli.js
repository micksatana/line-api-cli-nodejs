#!/usr/bin/env node
import colors from 'colors';
import Operation from '../operations/operation';
import theme from '../theme';

colors.setTheme(theme);

if (Operation.config) {
  const RichmenuCommand = require('../commands/richmenu-command').default;

  RichmenuCommand.cli();
}
