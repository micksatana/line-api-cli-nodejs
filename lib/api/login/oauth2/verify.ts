import Axios from 'axios';
import { requestData } from '../../common';

export const VERIFY_ENDPOINT = 'https://api.line.me/v2/oauth/verify';

export interface VerifyAccessTokenRequestData {
  access_token: string;
}

export const VerifyAccessTokenService = Axios.create({
  baseURL: VERIFY_ENDPOINT,
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  method: 'POST'
});

export const verifyAccessToken = requestData<VerifyAccessTokenRequestData>(
  VerifyAccessTokenService
);
