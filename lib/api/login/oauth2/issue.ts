import Axios from 'axios';
import { requestData } from '../../common';

export const ISSUE_ENDPOINT = 'https://api.line.me/v2/oauth/accessToken';

export interface IssueAccessTokenRequestData {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
}

export const IssueAccessTokenService = Axios.create({
  baseURL: ISSUE_ENDPOINT,
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  method: 'POST'
});

export const issueAccessToken = requestData<IssueAccessTokenRequestData>(
  IssueAccessTokenService
);
