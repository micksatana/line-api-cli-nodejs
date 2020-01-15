import LINETvRequest from './linetv-request';

export default class LINETvGetSpotlightRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/curation`;
  }
  /**
   * @param {number} channelId
   * @param {string} countryCode
   * @param {string} moduleName
   * @return
   */
  send(channelId, countryCode, moduleName) {
    return this.axios.get(
      `${this.endpoint}?lineChannelId=${channelId}&country=${countryCode}&module=${moduleName}`
    );
  }
}
