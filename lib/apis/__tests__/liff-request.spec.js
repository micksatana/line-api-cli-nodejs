import Axios from 'axios';
import LIFFRequest from '../liff-request';

describe('LIFFRequest', () => {
  describe('when create instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new LIFFRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/liff/v1/apps');
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
