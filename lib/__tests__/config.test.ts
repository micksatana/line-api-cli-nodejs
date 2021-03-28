import fs from 'fs';
import { loadConfig } from '../config';
import yaml from 'js-yaml';

const { clearAllMocks, restoreAllMocks, spyOn } = jest;

describe('loadConfig', () => {
  const newConfig = {};

  afterAll(() => {
    restoreAllMocks();
  });

  describe('file exists', () => {
    beforeAll(() => {
      spyOn(console, 'log').mockReturnValue();
      spyOn(fs, 'readFileSync').mockReturnValue('xxx');
    });
    afterAll(() => clearAllMocks());

    describe('failed to load yml', () => {
      beforeAll(() => {
        spyOn(process, 'exit').mockImplementation(() => {
          throw new Error('exited');
        });
        spyOn(yaml, 'load').mockImplementation(() => {
          throw new Error('failed');
        });
      });

      test('throw', () => {
        expect(() => loadConfig()).toThrow();
        expect(process.exit).toBeCalledWith(1);
      });
    });

    describe('able to load yml', () => {
      beforeAll(() => {
        spyOn(yaml, 'load').mockReturnValueOnce(newConfig);
      });

      test('success', () => {
        expect(loadConfig()).toEqual(newConfig);
      });
    });
  });

  describe('file not exists', () => {
    beforeAll(() => {
      spyOn(console, 'log').mockReturnValue();
      spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('not exists');
      });
      spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('exited');
      });
    });
    afterAll(() => clearAllMocks());

    test('exited', () => {
      expect(() => loadConfig()).toThrow();
      expect(process.exit).toBeCalledWith(0);
    });
  });
});
