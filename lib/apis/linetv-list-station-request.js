import LINETvRequest from './linetv-request';

export default class LINETvListStationRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/station`;
  }
 /**
   * @param {number} channelId
   * @param {string} channelCode
   * @return {AxiosResponse<LINETvListStationResponseData>}
   */
  send(channelId, countryCode) {
    return this.axios.get(`${this.endpoint}/list?lineChannelId=${channelId}&country=${countryCode}`);
  }
}

