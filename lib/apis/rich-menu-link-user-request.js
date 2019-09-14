import RichMenuRequest from './rich-menu-request';

export default class RichMenuLinkUserRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot';
  }
  send(richMenuId, userId) {
    return this.axios.post(
      `${this.endpoint}/user/${userId}/richmenu/${richMenuId}`
    );
  }
}
