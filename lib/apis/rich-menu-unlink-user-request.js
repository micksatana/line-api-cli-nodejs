import RichMenuRequest from './rich-menu-request';

export default class RichMenuUnlinkUserRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot';
  }
  send(userId) {
    return this.axios.delete(`${this.endpoint}/user/${userId}/richmenu`);
  }
}
