import Axios from 'axios';
import LINETvListModulesRequest from '../linetv-list-modules-request';

describe('LINEListModuleRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new LINETvListModulesRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/line-tv/v1/curation');
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

    describe('when send a request', () => {
      let channelId = '1234';
      let countryCode = 'th';
      beforeAll(() => {
        jest.spyOn(req.axios, 'get').mockResolvedValue('any');
        req.send(channelId, countryCode);
      });

      it('should call to correct endpoint', () => {
        expect(req.axios.get).toHaveBeenCalledTimes(1);
        expect(req.axios.get).toHaveBeenCalledWith(
          `${req.endpoint}/list?lineChannelId=${channelId}&country=${countryCode}`
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
