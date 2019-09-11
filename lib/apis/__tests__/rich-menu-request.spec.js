import Axios from 'axios';
import RichMenuRequest from '../rich-menu-request';

const { spyOn } = jest;

describe('RichMenuRequest', () => {
  describe('when create instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      spyOn(Axios, 'create');
      req = new RichMenuRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/v2/bot/richmenu');
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

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
