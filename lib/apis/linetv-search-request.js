import LINETvRequest from './linetv-request';

export default class LINETvRankingRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/search`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {number} page
   * @param {number} countPerPage
   * @param {string} query
   * @return {AxiosResponse<LINETvSearchResponseData>}
   */
  send(channelId, countryCode, query, page=1, countPerPage=10) {
    return this.axios.get(
      `${this.endpoint}/clip?lineChannelId=${channelId}&country=${countryCode}&query=${query}&page=${page}&countPerPage=${countPerPage}`
    );
  }
}
