import { REVOKE_ENDPOINT, RevokeAccessTokenService } from '../revoke';

describe('RevokeAccessTokenService', () => {
  test('endpoint', () => {
    expect(RevokeAccessTokenService.defaults.baseURL).toEqual(REVOKE_ENDPOINT);
  });
  test('method', () => {
    expect(RevokeAccessTokenService.defaults.method).toEqual('POST');
  });
  test('content-type', () => {
    expect(RevokeAccessTokenService.defaults.headers).toHaveProperty(
      'content-type',
      'application/x-www-form-urlencoded'
    );
  });
});
