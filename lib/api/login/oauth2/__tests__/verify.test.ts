import { VERIFY_ENDPOINT, VerifyAccessTokenService } from '../verify';

describe('VerifyAccessTokenService', () => {
  test('endpoint', () => {
    expect(VerifyAccessTokenService.defaults.baseURL).toEqual(VERIFY_ENDPOINT);
  });
  test('method', () => {
    expect(VerifyAccessTokenService.defaults.method).toEqual('POST');
  });
  test('content-type', () => {
    expect(VerifyAccessTokenService.defaults.headers).toHaveProperty(
      'content-type',
      'application/x-www-form-urlencoded'
    );
  });
});
