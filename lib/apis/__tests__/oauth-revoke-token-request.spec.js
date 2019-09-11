import qs from 'qs';
import OAuthRevokeTokenRequest from '../oauth-revoke-token-request';
import OAuthRequest from '../oauth-request';

describe('OAuthRevokeTokenRequest', () => {
  const accessToken = 'testAccessToken';
  const expectedEndpoint = 'https://api.line.me/v2/oauth/revoke';
  const fakeResult = 'any';
  let req;
  let result;

  beforeAll(async () => {
    req = new OAuthRevokeTokenRequest();
    jest.spyOn(req.axios, 'post').mockResolvedValue(fakeResult);
    result = await req.send(accessToken);
  });

  it('is instance of OAuthRequest', () => {
    expect(req instanceof OAuthRequest).toEqual(true);
  });

  it('has correct endpoint', () => {
    expect(req.endpoint).toEqual(expectedEndpoint);
  });

  it('call correct method with correct data', () => {
    expect(req.axios.post).toHaveBeenCalledWith(
      expectedEndpoint,
      qs.stringify({
        access_token: accessToken
      })
    );
  });

  it('has correct result', () => {
    expect(result).toEqual(fakeResult);
  });
});
