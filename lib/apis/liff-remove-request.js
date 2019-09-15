import LIFFRequest from './liff-request';

export default class LIFFRemoveRequest extends LIFFRequest {
  constructor(options) {
    super(options);
  }
  send(liffId) {
    return this.axios.delete(`${this.endpoint}/${liffId}`);
  }
}
