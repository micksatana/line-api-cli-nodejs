import Axios from 'axios';
import ThingsRemoveTrialProductRequest from '../things-remove-trial-product-request';

describe('ThingsRemoveTrialProductRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new ThingsRemoveTrialProductRequest({ accessToken });
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

    describe('when send productId', () => {
      let productId = 'shkf2h39fwef';
      beforeAll(() => {
        jest.spyOn(req.axios, 'delete').mockResolvedValue('any');
        req.send(productId);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.delete).toHaveBeenCalledTimes(1);
        expect(req.axios.delete).toHaveBeenCalledWith(
          `${req.endpoint}/${productId}`
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
