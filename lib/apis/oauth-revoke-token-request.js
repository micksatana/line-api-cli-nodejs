import '../typedef';

import { AxiosResponse } from 'axios';
import qs from 'qs';
import OAuthRequest from './oauth-request';

export default class OAuthRevokeTokenRequest extends OAuthRequest {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/revoke`;
  }

  /**
   * @param {string} accessToken 
   * @return {AxiosResponse}
   */
  send(accessToken) {
    return this.axios.post(
      `${this.endpoint}`,
      qs.stringify({ access_token: accessToken })
    );
  }
}
