export const version = () => {
  const pjsonVersion = require('../../package.json').version;
  return `LINE API CLIs v${pjsonVersion}`;
};
