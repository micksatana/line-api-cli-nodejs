import Command from '../command';

test('versionText', () => {
  expect(Command.versionText).toContain(
    require('../../../package.json').version
  );
});
