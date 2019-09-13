"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _oauthIssueTokenRequest = _interopRequireDefault(require("./apis/oauth-issue-token-request"));

var _oauthRequest = _interopRequireDefault(require("./apis/oauth-request"));

var _oauthRevokeTokenRequest = _interopRequireDefault(require("./apis/oauth-revoke-token-request"));

var _richMenuAddRequest = _interopRequireDefault(require("./apis/rich-menu-add-request"));

var _richMenuListRequest = _interopRequireDefault(require("./apis/rich-menu-list-request"));

var _richMenuRemoveRequest = _interopRequireDefault(require("./apis/rich-menu-remove-request"));

var _richMenuRequest = _interopRequireDefault(require("./apis/rich-menu-request"));

var _richMenuSetDefaultRequest = _interopRequireDefault(require("./apis/rich-menu-set-default-request"));

var _richMenuUploadRequest = _interopRequireDefault(require("./apis/rich-menu-upload-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apis = {
  OAuthIssueTokenRequest: _oauthIssueTokenRequest.default,
  OAuthRequest: _oauthRequest.default,
  OAuthRevokeTokenRequest: _oauthRevokeTokenRequest.default,
  RichMenuAddRequest: _richMenuAddRequest.default,
  RichMenuListRequest: _richMenuListRequest.default,
  RichMenuRemoveRequest: _richMenuRemoveRequest.default,
  RichMenuRequest: _richMenuRequest.default,
  RichMenuSetDefaultRequest: _richMenuSetDefaultRequest.default,
  RichMenuUploadRequest: _richMenuUploadRequest.default
};
var _default = apis;
exports.default = _default;
//# sourceMappingURL=index.js.map