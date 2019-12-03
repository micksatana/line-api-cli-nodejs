import Axios from 'axios';
import ThingsGetProductScenarioSetRequest from '../things-get-product-scenario-set-request';

const { spyOn } = jest;

describe('ThingsGetProductScenarioSetRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    const accessToken = 'someaccesstoken';
    let req;

    beforeAll(() => {
      spyOn(Axios, 'create');
      req = new ThingsGetProductScenarioSetRequest({ accessToken });
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
        spyOn(req.axios, 'get').mockResolvedValue('any');
        req.send(productId);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.get).toHaveBeenCalledTimes(1);
        expect(req.axios.get).toHaveBeenCalledWith(
          `${req.endpoint}/${productId}/scenario-set`
        );
      });
      afterAll(() => {
        req.axios.get.mockRestore();
      });
    });

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
