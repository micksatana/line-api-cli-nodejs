import LINETvRequest from './linetv-request';

export default class LINETvListCategoryRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/category`;
  }
 /**
   * @param {number} channelId
   * @param {string} countryCode
   * @return {AxiosResponse<LINETvListCategoryResponseData>}
   */
  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/list?lineChannelId=${channelId}&country=${countryCode}`);
  }
}
