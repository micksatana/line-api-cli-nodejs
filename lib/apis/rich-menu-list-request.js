import RichMenuRequest from './rich-menu-request';

export default class RichMenuListRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
  }
  send() {
    return this.axios.get(`${this.endpoint}/list`);
  }
}
