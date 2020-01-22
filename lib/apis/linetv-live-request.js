import LINETvRequest from './linetv-request';

export default class LINETvLiveRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/live`;
  }
 /**
   * @param {number} channelId
   * @param {string} countryCode
   * @return {AxiosResponse<LINETvListModulesResponseData>}
   */
  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/schedule?lineChannelId=${channelId}&country=${countryCode}`);
  }
}
