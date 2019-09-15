import Axios from 'axios';
import LIFFUpdateRequest from '../liff-update-request';

describe('LIFFUpdateRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new LIFFUpdateRequest({ accessToken });
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

    describe('when send data', () => {
      let liffId = 'jfoifhbe949';
      let data = {
        view: {
          type: 'compact',
          url: 'https://blahblah'
        }
      };

      beforeAll(() => {
        jest.spyOn(req.axios, 'put').mockResolvedValue('any');
        req.send(liffId, data);
      });

      it('should call to correct endpoint', () => {
        expect(req.axios.put).toHaveBeenCalledTimes(1);
        expect(req.axios.put).toHaveBeenCalledWith(
          `${req.endpoint}/${liffId}`,
          JSON.stringify(data)
        );
      });

      afterAll(() => {
        req.axios.put.mockRestore();
      });
    });

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
