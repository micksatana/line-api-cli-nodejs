import Axios from 'axios';
import ThingsRemoveProductScenarioSetRequest from '../things-remove-product-scenario-set-request';

const { spyOn } = jest;

describe('ThingsRemoveProductScenarioSetRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    const accessToken = 'someaccesstoken';
    let req;

    beforeAll(() => {
      spyOn(Axios, 'create');
      req = new ThingsRemoveProductScenarioSetRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/things/v1/products');
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
      const productId = 'shkf2h39fwef';

      beforeAll(() => {
        spyOn(req.axios, 'delete').mockResolvedValue('any');
        req.send(productId);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.delete).toHaveBeenCalledTimes(1);
        expect(req.axios.delete).toHaveBeenCalledWith(
          `${req.endpoint}/${productId}/scenario-set`
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
