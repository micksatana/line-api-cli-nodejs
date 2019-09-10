import LINECommand from '../line-command';

describe('line-cli', () => {
  beforeAll(() => {
    jest.spyOn(LINECommand, 'cli').mockResolvedValue(undefined);
  });

  it('run cli', () => {
    require('../line-cli');
    expect(LINECommand.cli).toHaveBeenCalledTimes(1);
  });

  afterAll(() => LINECommand.cli.mockRestore());
});
