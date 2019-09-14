import '../typedef';

import LIFFRequest from './liff-request';

export default class LIFFListRequest extends LIFFRequest {
  constructor(options) {
    super(options);
  }
  /**
   * @return {import('axios').AxiosResponse<LIFFListResponseData>}
   */
  send() {
    return this.axios.get(this.endpoint);
  }
}
