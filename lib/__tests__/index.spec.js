import apis from '../index';

test('index provides access to API classes', () => {
  expect(apis.OAuthIssueTokenRequest).toBeDefined();
  expect(apis.OAuthRequest).toBeDefined();
});
