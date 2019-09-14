import Axios from 'axios';

export default class LIFFRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/liff/v1/apps';
    this.axios = Axios.create({
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        'content-type': 'application/json'
      }
    });
  }
}
