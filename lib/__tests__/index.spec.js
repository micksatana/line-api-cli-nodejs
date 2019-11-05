import apis from '../index';

test('index provides access to API classes', () => {
  expect(apis.LIFFAddRequest).toBeDefined();
  expect(apis.LIFFListRequest).toBeDefined();
  expect(apis.LIFFRemoveRequest).toBeDefined();
  expect(apis.LIFFRequest).toBeDefined();
  expect(apis.OAuthIssueTokenRequest).toBeDefined();
  expect(apis.OAuthRequest).toBeDefined();
  expect(apis.OAuthRevokeTokenRequest).toBeDefined();
  expect(apis.RichMenuAddRequest).toBeDefined();
  expect(apis.RichMenuListRequest).toBeDefined();
  expect(apis.RichMenuRemoveRequest).toBeDefined();
  expect(apis.RichMenuRequest).toBeDefined();
  expect(apis.RichMenuSetDefaultRequest).toBeDefined();
  expect(apis.RichMenuUploadRequest).toBeDefined();
  expect(apis.ThingsListTrialProductsRequest).toBeDefined();
  expect(apis.ThingsRemoveTrialProductRequest).toBeDefined();
  expect(apis.ThingsRequest).toBeDefined();
});
