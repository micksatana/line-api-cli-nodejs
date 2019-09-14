import Axios from 'axios';
import RichMenuUnlinkUserRequest from '../rich-menu-unlink-user-request';

describe('RichMenuUnlinkUserRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new RichMenuUnlinkUserRequest({ accessToken });
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
      let userId = 'U0039cxxxx';

      beforeAll(() => {
        jest.spyOn(req.axios, 'delete').mockResolvedValue('any');
        req.send(userId);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.delete).toHaveBeenCalledTimes(1);
        expect(req.axios.delete).toHaveBeenCalledWith(
          `${req.endpoint}/user/${userId}/richmenu`
        );
      });
      afterAll(() => {
        req.axios.delete.mockRestore();
      });
    });

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
