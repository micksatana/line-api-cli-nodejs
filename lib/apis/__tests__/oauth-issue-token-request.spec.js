import qs from 'qs';
import OAuthIssueTokenRequest from '../oauth-issue-token-request';
import OAuthRequest from '../oauth-request';

describe('OAuthIssueTokenRequest', () => {
  const channelId = 'testChannelId';
  const channelSecret = 'testChannelSecret';
  const expectedEndpoint = 'https://api.line.me/v2/oauth/accessToken';
  const fakeResult = 'any';
  let req;
  let result;

  beforeAll(async () => {
    req = new OAuthIssueTokenRequest();
    jest.spyOn(req.axios, 'post').mockResolvedValue(fakeResult);
    result = await req.send(channelId, channelSecret);
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
        grant_type: 'client_credentials',
        client_id: channelId,
        client_secret: channelSecret
      })
    );
  });

  it('has correct result', () => {
    expect(result).toEqual(fakeResult);
  });
});
