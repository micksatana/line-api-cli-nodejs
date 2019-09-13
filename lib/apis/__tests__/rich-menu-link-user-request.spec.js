import Axios from 'axios';
import RichMenuLinkUserRequest from '../rich-menu-link-user-request';

describe('RichMenuLinkUserRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new RichMenuLinkUserRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/v2/bot');
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
      let userId = 'Uajsodfhwh';
      let richMenuId = 'asffleifjsd';
      beforeAll(() => {
        jest.spyOn(req.axios, 'post').mockResolvedValue('any');
        req.send(richMenuId, userId);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.post).toHaveBeenCalledTimes(1);
        expect(req.axios.post).toHaveBeenCalledWith(
          `${req.endpoint}/user/${userId}/richmenu/${richMenuId}`
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
