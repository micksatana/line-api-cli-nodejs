import LINETvRequest from './linetv-request';

export default class LINETvListModulesRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/curation`;
  }
 /**
   * @param {number} channelId
   * @param {string} channelCode
   * @return {AxiosResponse<LINETvListModulesResponseData>}
   */
  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/list?lineChannelId=${channelId}&country=${countryCode}`);
  }
}
