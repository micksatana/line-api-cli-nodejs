import '../typedef';

import RichMenuRequest from './rich-menu-request';

export default class RichMenuListRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
  }
  /**
   * @return {import('axios').AxiosResponse<RichmenuListResponseData>}
   */
  send() {
    return this.axios.get(`${this.endpoint}/list`);
  }
}
