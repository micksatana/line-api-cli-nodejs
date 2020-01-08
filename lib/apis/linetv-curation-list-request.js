import LINETvRequest from './linetv-request';

export default class LINETvCurationListRequest extends LINETvRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/curation`;
  }

  send(LINEChannelId, countryId) {
    return this.axios.get(`${this.endpoint}/list?lineChannelId=${LINEChannelId}&country=${countryId}`);
  }
}
