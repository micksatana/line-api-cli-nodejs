import LINETvRequest from './linetv-request';

export default class LINETvRankingRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/ranking`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {number} page
   * @param {number} countPerPage
   * @return {AxiosResponse<LINETvRankingResponseData>}
   */
  send(channelId, countryCode, page=1, countPerPage=10) {
    return this.axios.get(
      `${this.endpoint}/clip?lineChannelId=${channelId}&country=${countryCode}&page=${page}&countPerPage=${countPerPage}`
    );
  }
}

