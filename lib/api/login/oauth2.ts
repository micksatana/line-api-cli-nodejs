import Axios from 'axios';
import { requestData } from '../common';

export const ISSUE_ENDPOINT = 'https://api.line.me/oauth2/v2.1/token';
export const REVOKE_ENDPOINT = 'https://api.line.me/oauth2/v2.1/revoke';

export interface IssueAccessTokenAuthCodeRequestData {
  grant_type: 'authorization_code';
  code: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}

export interface IssueAccessTokenClientCredentialsRequestData {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
}

export const IssueAccessTokenService = Axios.create({
  baseURL: ISSUE_ENDPOINT,
  headers: {
    'content-type': 'application/x-www-form-urlencode'
  },
  method: 'POST'
});

export const issueAccessToken = requestData<
  | IssueAccessTokenAuthCodeRequestData
  | IssueAccessTokenClientCredentialsRequestData
>(IssueAccessTokenService);

export interface RevokeAccessTokenRequestData {
  access_token: string;
  client_id: string;
  client_secret: string;
}

export const RevokeAccessTokenService = Axios.create({
  baseURL: REVOKE_ENDPOINT,
  headers: {
    'content-type': 'application/x-www-form-urlencode'
  },
  method: 'POST'
});

export const revokeAccessToken = requestData<RevokeAccessTokenRequestData>(
  RevokeAccessTokenService
);
