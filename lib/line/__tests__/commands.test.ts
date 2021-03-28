import { commands } from '../commands';

describe('commands', () => {
  test('load all from directories', () => {
    const cmds = commands();
    ['init', 'token'].map((expected) => {
      expect(cmds[expected].usage).toBeDefined();
      expect(typeof cmds[expected].command).toEqual('function');
    });
  });
});
