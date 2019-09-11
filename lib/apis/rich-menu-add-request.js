import RichMenuRequest from './rich-menu-request';

export default class RichMenuAddRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
  }
  send(data) {
    return this.axios.post(this.endpoint, JSON.stringify(data));
  }
}
