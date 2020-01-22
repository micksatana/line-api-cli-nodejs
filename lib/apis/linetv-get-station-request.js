import LINETvRequest from './linetv-request';

export default class LINETvGetStationRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/station`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {string} stationId
   * @param {number} page
   * @return {AxiosResponse<LINETvGetStationResponseData>}
   */
  send(channelId, countryCode, stationId, page=1) {
    return this.axios.get(
      `${this.endpoint}?lineChannelId=${channelId}&country=${countryCode}&stationId=${stationId}&page=${page}`
    );
  }
}
