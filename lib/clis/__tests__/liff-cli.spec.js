import LIFFCommand from '../../commands/liff-command';

describe('liff-cli', () => {
  beforeAll(() => {
    jest.spyOn(LIFFCommand, 'cli').mockResolvedValue(undefined);
  });

  it('run cli', () => {
    require('../liff-cli');
    expect(LIFFCommand.cli).toHaveBeenCalledTimes(1);
  });

  afterAll(() => LIFFCommand.cli.mockRestore());
});
