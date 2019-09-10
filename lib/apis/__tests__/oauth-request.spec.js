import { OAuthRequest } from '../oauth-request';

describe('OAuthRequest', () => {
  let req;

  beforeAll(() => {
    req = new OAuthRequest();
  });

  it('has correct endpoint', () => {
    expect(req.endpoint).toEqual('https://api.line.me/v2/oauth');
  });

  it('has axios defined correctly', () => {
    expect(req.axios).toBeDefined();
    expect(req.axios.defaults.headers['content-type']).toEqual(
      'application/x-www-form-urlencoded'
    );
  });
});
