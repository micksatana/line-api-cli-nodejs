import Axios from 'axios';

export default class LINETvRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/line-tv/v1';
    this.axios = Axios.create({
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        'content-type': 'application/json'
      }
    });
  }
}
