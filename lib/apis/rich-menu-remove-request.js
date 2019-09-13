import RichMenuRequest from './rich-menu-request';

export default class RichMenuRemoveRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
  }
  send(richMenuId) {
    return this.axios.delete(`${this.endpoint}/${richMenuId}`);
  }
}
