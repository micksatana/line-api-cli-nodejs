import '../typedef';

import LIFFRequest from './liff-request';

export default class LIFFUpdateRequest extends LIFFRequest {
  constructor(options) {
    super(options);
  }
  /**
   * @param {string} liffId 
   * @param {LIFFUpdateRequestData} data 
   */
  send(liffId, data) {
    return this.axios.put(`${this.endpoint}/${liffId}`, JSON.stringify(data));
  }
}
