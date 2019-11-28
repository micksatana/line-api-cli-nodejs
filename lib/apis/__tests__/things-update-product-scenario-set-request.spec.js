import Axios from 'axios';
import ThingsUpdateProductScenarioSetRequest from '../things-update-product-scenario-set-request';

const { spyOn } = jest;

describe('ThingsUpdateProductScenarioSetRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    const accessToken = 'someaccesstoken';
    let req;

    beforeAll(() => {
      spyOn(Axios, 'create');
      req = new ThingsUpdateProductScenarioSetRequest({ accessToken });
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
      const data = {
        autoClose: false,
        suppressionInterval: 0,
        scenarios: [
          {
            trigger: {
              type: 'BLE_NOTIFICATION',
              serviceUuid: '4812a0a6-10af-4afb-91f0-b4434e55763b',
              characteristicUuid: '91a6fb1d-d365-4229-9d41-4358a96388e3'
            },
            actions: [
              {
                type: 'SLEEP',
                sleepMillis: 1000
              },
              {
                type: 'GATT_READ',
                serviceUuid: '4812a0a6-10af-4afb-91f0-b4434e55763b',
                characteristicUuid: '91a6fb1d-d365-4229-9d41-4358a96388e3'
              },
              {
                type: 'GATT_WRITE',
                serviceUuid: '4812a0a6-10af-4afb-91f0-b4434e55763b',
                characteristicUuid: '91a6fb1d-d365-4229-9d41-4358a96388e3',
                data: 'Zm9vCg=='
              }
            ]
          }
        ]
      };

      beforeAll(() => {
        spyOn(req.axios, 'put').mockResolvedValue('any');
        req.send(productId, data);
      });
      it('should call to correct endpoint', () => {
        expect(req.axios.put).toHaveBeenCalledTimes(1);
        expect(req.axios.put).toHaveBeenCalledWith(
          `${req.endpoint}/${productId}/scenario-set`,
          data
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
