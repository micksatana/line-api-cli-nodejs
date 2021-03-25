import { ISSUE_ENDPOINT, IssueAccessTokenService } from '../oauth2';

describe('IssueAccessTokenService', () => {
  test('endpoint', () => {
    expect(IssueAccessTokenService.defaults.baseURL).toEqual(ISSUE_ENDPOINT);
  });
  test('method', () => {
    expect(IssueAccessTokenService.defaults.method).toEqual('POST');
  });
  test('content-type', () => {
    expect(IssueAccessTokenService.defaults.headers).toHaveProperty(
      'content-type',
      'application/x-www-form-urlencode'
    );
  });
});
