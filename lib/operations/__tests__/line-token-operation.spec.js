import { EOL } from 'os';
import LINETokenOperation from '../line-token-operation';
import Operation from '../operation';
import ImageHelper from '../../image-helper';

const { spyOn, mock, unmock } = jest;

describe('line token', () => {
  it('extends Operation', () => {
    expect(LINETokenOperation.prototype instanceof Operation).toEqual(true);
  });

  it('has usage', () => {
    expect(LINETokenOperation.usage).toEqual([
      {
        header: 'Issue/Revoke access token '.help,
        content:
          `After channel ID and secret are configured. Issue a channel access token and save it.` +
          EOL +
          EOL +
          `line token --issue`.code +
          EOL +
          EOL +
          `In case you want to revoke an access token, you can run with --revoke option.` +
          EOL +
          EOL +
          `line token --revoke`.code
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'issue'.code,
            description:
              'Issue a channel access token from pre-configured channel ID and secret'
          },
          {
            name: 'revoke'.code,
            typeLabel: '{underline accessToken}'.input,
            description: 'Revoke a channel access token.'
          }
        ]
      }
    ]);
  });

  it('runnable', () => {
    expect(typeof LINETokenOperation.run).toEqual('function');
  });

  describe('when not provided option', () => {
    const mockUsage = 'mocked usage';
    let commandLineUsage;

    beforeAll(() => {
      mock('command-line-usage');
      commandLineUsage = require('command-line-usage');
      commandLineUsage.mockReturnValue(mockUsage);

      spyOn(ImageHelper, 'draw').mockReturnValue(undefined);
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    beforeEach(() => {
      ImageHelper.draw.mockClear();
      console.log.mockClear();
    });

    it('returns help', async () => {
      await expect(LINETokenOperation.run()).resolves.toEqual(false);
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(console.log).toHaveBeenCalledWith(mockUsage);
    });

    it('returns help', async () => {
      await expect(LINETokenOperation.run({})).resolves.toEqual(false);
      expect(ImageHelper.draw).toHaveBeenCalledWith('chick-helps');
      expect(console.log).toHaveBeenCalledWith(mockUsage);
    });

    afterAll(() => {
      ImageHelper.draw.mockRestore();
      commandLineUsage.mockRestore();
      unmock('command-line-usage');
      console.log.mockRestore();
    });
  });

  describe('when provided issue option', () => {
    beforeAll(() => {
      spyOn(LINETokenOperation, 'issue').mockResolvedValue(true);
    });

    it('returns help', async () => {
      await expect(LINETokenOperation.run({ issue: true })).resolves.toEqual(
        true
      );
      expect(LINETokenOperation.issue).toHaveBeenCalled();
    });

    afterAll(() => {
      LINETokenOperation.issue.mockRestore();
    });
  });

  describe('when provided revoke option', () => {
    beforeAll(() => {
      spyOn(LINETokenOperation, 'revoke').mockResolvedValue(true);
    });

    it('returns help', async () => {
      await expect(LINETokenOperation.run({ revoke: true })).resolves.toEqual(
        true
      );
      expect(LINETokenOperation.revoke).toHaveBeenCalled();
    });

    afterAll(() => {
      LINETokenOperation.revoke.mockRestore();
    });
  });

  describe('when channel ID not found', () => {
    beforeAll(() => {
      spyOn(LINETokenOperation, 'config', 'get').mockReturnValue({
        channel: {}
      });
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    it('display suggestion', async () => {
      await expect(LINETokenOperation.run({ issue: true })).resolves.toEqual(false);
      expect(console.log).toHaveBeenCalledWith(`Channel ID not found`.warn);
      expect(console.log).toHaveBeenCalledWith(
        `Setup channel ID at ${LINETokenOperation.configFileName.info} and re-run again`
          .help
      );
    });

    afterAll(() => {
      console.log.mockRestore();
      LINETokenOperation.config.mockRestore();
    });
  });

  describe('when channel secret not found', () => {
    beforeAll(() => {
      spyOn(LINETokenOperation, 'config', 'get').mockReturnValue({
        channel: {
          id: 1234
        }
      });
      spyOn(console, 'log').mockReturnValue(undefined);
    });

    it('display suggestion', async () => {
      await expect(LINETokenOperation.run({ issue: true })).resolves.toEqual(false);
      expect(console.log).toHaveBeenCalledWith(`Channel secret not found`.warn);
      expect(console.log).toHaveBeenCalledWith(
        `Setup channel secret at ${LINETokenOperation.configFileName.info} and re-run again`
          .help
      );
    });

    afterAll(() => {
      console.log.mockRestore();
      LINETokenOperation.config.mockRestore();
    });
  });
});
