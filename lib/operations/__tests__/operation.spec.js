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

  beforeAll(() => {
    spyOn(console, 'log').mockReturnValue(undefined);
    spyOn(process, 'exit').mockReturnValue(undefined);
  });

  beforeEach(() => {
    console.log.mockClear();
    process.exit.mockClear();
  });

  describe('when config file not exists', () => {
    beforeAll(() => {
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
        } to initialize project configuration file`.help
      );
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    afterAll(() => {
      fs.readFileSync.mockRestore();
    });
  });

  describe('when config file exists', () => {
    const mockFile = {};
    const mockConfig = { channel: {} };

    beforeAll(() => {
      spyOn(fs, 'readFileSync').mockReturnValue(mockFile);
    });

    beforeEach(() => {
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
    });
  });

  describe('validateConfig', () => {
    it('handles missing channel.id', () => {
      Operation._config = {
        channel: {}
      };
      expect(Operation.validateConfig()).toEqual(false);
      expect(console.log).toHaveBeenCalledWith(
        `Run command ${
          `line init`.code
        } to initialize project configuration file`.help
      );
    });

    it('handles missing channel.secret', () => {
      Operation._config = {
        channel: {
          id: 1234
        }
      };
      expect(Operation.validateConfig()).toEqual(false);
      expect(console.log).toHaveBeenCalledWith(
        `Run command ${
          `line init`.code
        } to initialize project configuration file`.help
      );
    });

    it('handles missing channel.accessToken', () => {
      Operation._config = {
        channel: {
          id: 1234,
          secret: 'xxxxx'
        }
      };
      expect(Operation.validateConfig()).toEqual(false);
      expect(console.log).toHaveBeenCalledWith(
        `Run command ${
          `line token --issue`.code
        } and save access token project configuration file`.help
      );
    });

    it('handles success', () => {
      Operation._config = {
        channel: {
          id: 1234,
          secret: 'xxxxx',
          accessToken: 'yyyyy'
        }
      };
      expect(Operation.validateConfig()).toEqual(true);
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('validateFileExists', () => {
    describe('when file exists', () => {
      beforeAll(() => {
        spyOn(fs, 'existsSync').mockReturnValue(true);
      });

      it('return true', () => {
        expect(Operation.validateFileExists('xxx')).toEqual(true);
        expect(fs.existsSync).toHaveBeenCalledWith('xxx');
      });

      afterAll(() => {
        fs.existsSync.mockRestore();
      });
    });

    describe('when file not exists', () => {
      beforeAll(() => {
        spyOn(fs, 'existsSync').mockReturnValue(false);
      });

      it('return true', () => {
        expect(Operation.validateFileExists('xxx')).toEqual('File not exists');
        expect(fs.existsSync).toHaveBeenCalledWith('xxx');
      });

      afterAll(() => {
        fs.existsSync.mockRestore();
      });
    });

    describe('when no input', () => {
      beforeAll(() => {
        spyOn(fs, 'existsSync').mockReturnValue(false);
      });

      it('return true', () => {
        expect(Operation.validateFileExists()).toEqual(
          'Please input data file location to proceed.'
        );
        expect(fs.existsSync).not.toHaveBeenCalled();
      });

      afterAll(() => {
        fs.existsSync.mockRestore();
      });
    });
  });

  afterAll(() => {
    console.log.mockRestore();
    process.exit.mockRestore();
    delete Operation._config;
  });
});
