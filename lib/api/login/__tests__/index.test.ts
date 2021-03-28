import {
  issueAccessToken,
  revokeAccessToken,
  verifyAccessToken
} from '../index';

test('import', () => {
  expect(issueAccessToken).toBeDefined();
  expect(revokeAccessToken).toBeDefined();
  expect(verifyAccessToken).toBeDefined();
});
