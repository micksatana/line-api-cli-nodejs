import Axios from 'axios';
import RichMenuSetDefaultRequest from '../rich-menu-set-default-request';

describe('RichMenuSetDefaultRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new RichMenuSetDefaultRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual(
        'https://api.line.me/v2/bot/user/all/richmenu'
      );
    });

    it('should create axios instance with correct headers for LINE API', () => {
      expect(Axios.create).toHaveBeenCalledWith({
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        }
      });
      expect(req.axios).toBeDefined();
    });

    describe('when send richMenuId', () => {
      let richMenuId = 'sdlfjoee';
      beforeAll(() => {
        jest.spyOn(req.axios, 'post').mockResolvedValue('any');
        req.send(richMenuId);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.post).toHaveBeenCalledTimes(1);
        expect(req.axios.post).toHaveBeenCalledWith(
          `${req.endpoint}/${richMenuId}`
        );
      });
      afterAll(() => {
        req.axios.post.mockRestore();
      });
    });

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
