import Axios from 'axios';
import fs from 'fs';
import RichMenuUploadRequest from '../rich-menu-upload-request';

const { spyOn } = jest;

describe('RichMenuUploadRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      spyOn(Axios, 'create');
      req = new RichMenuUploadRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/v2/bot/richmenu');
    });

    it('should create axios instance with correct headers for LINE API', () => {
      expect(Axios.create).toHaveBeenCalledWith({
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'image/jpeg'
        }
      });
      expect(req.axios).toBeDefined();
    });

    describe('when send data', () => {
      let richMenuId = 'sdlfhaos';
      let imagePath = 'blah/blah.pdf';
      let fakeStat = { size: 8888 };
      let fakeStream = {};

      describe('and no error in file stat', () => {
        beforeAll(() => {
          spyOn(fs, 'createReadStream').mockImplementation(() => fakeStream);
          spyOn(fs, 'stat').mockImplementation((path, callback) =>
            callback(null, fakeStat)
          );
          spyOn(req.axios, 'post').mockResolvedValue('any');
          req.send(richMenuId, imagePath);
        });

        it('should have correct content-length in headers', () => {
          expect(req.axios.defaults.headers.common['content-length']).toEqual(
            fakeStat.size
          );
        });

        it('should get file stat', () => {
          expect(fs.stat).toHaveBeenCalledWith(imagePath, expect.anything());
        });

        it('should send read stream', () => {
          expect(fs.createReadStream).toHaveBeenCalledWith(imagePath);
          expect(req.axios.post).toHaveBeenCalledTimes(1);
          expect(req.axios.post).toHaveBeenCalledWith(
            `${req.endpoint}/${richMenuId}/content`,
            fakeStream
          );
        });

        afterAll(() => {
          fs.createReadStream.mockRestore();
          fs.stat.mockRestore();
          req.axios.post.mockRestore();
        });
      });

      describe('and has error in file stat', () => {
        let expectedError = new Error('some error in file stat');

        beforeAll(() => {
          spyOn(fs, 'createReadStream').mockImplementation(() => fakeStream);
          spyOn(fs, 'stat').mockImplementation((path, callback) =>
            callback(expectedError, null)
          );
          spyOn(req.axios, 'post').mockResolvedValue('any');
        });

        it('should reject with the error', () => {
          expect(req.send(richMenuId, imagePath)).rejects.toEqual(
            expectedError
          );
        });

        afterAll(() => {
          fs.createReadStream.mockRestore();
          fs.stat.mockRestore();
          req.axios.post.mockRestore();
        });
      });
    });

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
