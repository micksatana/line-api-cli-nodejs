import Axios from 'axios';
import ThingsAddTrialRequest from '../things-add-trial-request';

describe('ThingsAddTrialRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new ThingsAddTrialRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual(
        'https://api.line.me/things/v1/trial/products'
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

    describe('when send data', () => {
      let liffId = 'aaaaa';
      let productName = 'Product A';
      let data = { liffId, name: productName };

      beforeAll(() => {
        jest.spyOn(req.axios, 'post').mockResolvedValue('any');
        req.send(liffId, productName);
      });

      it('should call to correct endpoint', () => {
        expect(req.axios.post).toHaveBeenCalledTimes(1);
        expect(req.axios.post).toHaveBeenCalledWith(
          req.endpoint,
          JSON.stringify(data)
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
