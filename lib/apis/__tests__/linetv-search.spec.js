import Axios from 'axios';
import LINETvSearchRequest from '../linetv-search-request';

describe('LINERankingRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new LINETvSearchRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/line-tv/v1/search');
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
      let query = 'inth';
      let page = '1';
      let countPerPage = '10';

      beforeAll(() => {
        jest.spyOn(req.axios, 'get').mockResolvedValue('any');
        req.send(channelId, countryCode, query);
      });

      it('should call to correct endpoint', () => {
        expect(req.axios.get).toHaveBeenCalledTimes(1);
        expect(req.axios.get).toHaveBeenCalledWith(
          `${req.endpoint}/clip?lineChannelId=${channelId}&country=${countryCode}&query=${query}&page=${page}&countPerPage=${countPerPage}`
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
