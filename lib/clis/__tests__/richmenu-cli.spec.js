import RichmenuCommand from '../../commands/richmenu-command';

describe('richmenu-cli', () => {
  beforeAll(() => {
    jest.spyOn(RichmenuCommand, 'cli').mockResolvedValue(undefined);
  });

  it('run cli', () => {
    require('../richmenu-cli');
    expect(RichmenuCommand.cli).toHaveBeenCalledTimes(1);
  });

  afterAll(() => RichmenuCommand.cli.mockRestore());
});
