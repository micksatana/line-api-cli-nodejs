import LINETvRequest from './linetv-request';

export default class LINETvGetCategoryRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/category`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {string} categoryCode
   * @param {number} page
   * @param {number} countPerPage
   * @return {AxiosResponse<LINETvGetCategoryResponseData>}
   */
  send(channelId, countryCode, categoryCode, page=1, countPerPage=10) {
    return this.axios.get(
      `${this.endpoint}?lineChannelId=${channelId}&country=${countryCode}&categoryCode=${categoryCode}&page=${page}&countPerPage=${countPerPage}`
    );
  }
}
