import Axios from 'axios';

export class OAuthRequest {
  constructor() {
    this.endpoint = 'https://api.line.me/v2/oauth';
    this.axios = Axios.create({
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
  }
}
