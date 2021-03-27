import Axios from 'axios';
import { requestData } from '../../common';

export const REVOKE_ENDPOINT = 'https://api.line.me/v2/oauth/revoke';

export interface RevokeAccessTokenRequestData {
  access_token: string;
}

export const RevokeAccessTokenService = Axios.create({
  baseURL: REVOKE_ENDPOINT,
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  method: 'POST'
});

export const revokeAccessToken = requestData<RevokeAccessTokenRequestData>(
  RevokeAccessTokenService
);
