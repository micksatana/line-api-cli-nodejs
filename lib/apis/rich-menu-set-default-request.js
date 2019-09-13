import RichMenuRequest from './rich-menu-request';

export default class RichMenuSetDefaultRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot/user/all/richmenu';
  }
  send(richMenuId) {
    return this.axios.post(`${this.endpoint}/${richMenuId}`);
  }
}
