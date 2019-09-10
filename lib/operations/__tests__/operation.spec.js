import fs from 'fs';
import yaml from 'js-yaml';

import Operation from '../operation';

const { spyOn } = jest;

describe('Operation', () => {
  it('has correct file name', () => {
    expect(Operation.configFileName).toEqual('.line-api-cli.yml');
  });

  it('can get config', () => {
    Operation._config = { channel: 'some fake channel' };
    expect(Operation.config).toEqual(Operation._config);
  });

  describe('when config file not exists', () => {
    beforeAll(() => {
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(process, 'exit').mockReturnValue(undefined);
      spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });
      delete Operation._config;
    });

    it('display suggestion', () => {
      expect(Operation.config);
      expect(console.log).toHaveBeenCalledWith(
        `Run command ${
          `line init`.code
        } to initialize project configuration file first`.help
      );
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    afterAll(() => {
      fs.readFileSync.mockRestore();
      console.log.mockRestore();
      process.exit.mockRestore();
    });
  });

  describe('when config file exists', () => {
    const mockFile = {};
    const mockConfig = { channel: {} };

    beforeAll(() => {
      spyOn(console, 'log').mockReturnValue(undefined);
      spyOn(process, 'exit').mockReturnValue(undefined);
      spyOn(fs, 'readFileSync').mockReturnValue(mockFile);
    });

    beforeEach(() => {
      console.log.mockClear();
      process.exit.mockClear();
      delete Operation._config;
    });

    describe('and able to safe load yaml', () => {
      beforeAll(() => {
        spyOn(yaml, 'safeLoad').mockReturnValue(mockConfig);
      });

      it('display suggestion', () => {
        expect(Operation.config).toEqual(Operation._config);
        expect(console.log).not.toHaveBeenCalled();
        expect(process.exit).not.toHaveBeenCalled();
      });

      afterAll(() => {
        yaml.safeLoad.mockRestore();
      });
    });

    describe('and failed to safe load yaml', () => {
      const error = new Error('yaml error');

      beforeAll(() => {
        spyOn(yaml, 'safeLoad').mockImplementation(() => {
          throw error;
        });
      });

      it('display suggestion', () => {
        expect(Operation.config);
        expect(console.log).toHaveBeenCalledWith(
          'Unable to safe load configuration file',
          error
        );
        expect(process.exit).toHaveBeenCalledWith(1);
      });

      afterAll(() => {
        yaml.safeLoad.mockRestore();
      });
    });

    afterAll(() => {
      fs.readFileSync.mockRestore();
      console.log.mockRestore();
      process.exit.mockRestore();
    });
  });
});
