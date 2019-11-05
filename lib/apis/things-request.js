import Axios from 'axios';

export default class ThingsRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/things/v1';
    this.axios = Axios.create({
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        'content-type': 'application/json'
      }
    });
  }
}
