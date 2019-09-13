import colors from 'colors';
import theme from './lib/theme';
import Operation from './lib/operations/operation';

colors.setTheme(theme);

// To make sure, not accidentally use real configuration during tests
Operation._config = {
  channel: {
    id: 999999,
    secret: 'global mock secret',
    accessToken: 'global mock access token'
  }
};
