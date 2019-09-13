import apis from '../index';

test('index provides access to API classes', () => {
  expect(apis.OAuthIssueTokenRequest).toBeDefined();
  expect(apis.OAuthRequest).toBeDefined();
  expect(apis.OAuthRevokeTokenRequest).toBeDefined();
  expect(apis.RichMenuAddRequest).toBeDefined();
  expect(apis.RichMenuListRequest).toBeDefined();
  expect(apis.RichMenuRemoveRequest).toBeDefined();
  expect(apis.RichMenuRequest).toBeDefined();
  expect(apis.RichMenuSetDefaultRequest).toBeDefined();
  expect(apis.RichMenuUploadRequest).toBeDefined();
});
