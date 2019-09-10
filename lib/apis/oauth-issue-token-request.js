import '../typedef';

import { AxiosResponse } from 'axios';
import qs from 'qs';
import OAuthRequest from './oauth-request';

export default class OAuthIssueTokenRequest extends OAuthRequest {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/accessToken`;
  }

  /**
   * @param {number} channelId
   * @param {string} channelSecret
   * @return {AxiosResponse<IssuedTokenData>}
   */
  send(channelId, channelSecret) {
    return this.axios.post(
      `${this.endpoint}`,
      qs.stringify({
        grant_type: 'client_credentials',
        client_id: channelId,
        client_secret: channelSecret
      })
    );
  }
}
