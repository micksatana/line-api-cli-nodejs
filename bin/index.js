"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _oauthIssueTokenRequest = _interopRequireDefault(require("./apis/oauth-issue-token-request"));

var _oauthRequest = _interopRequireDefault(require("./apis/oauth-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apis = {
  OAuthIssueTokenRequest: _oauthIssueTokenRequest.default,
  OAuthRequest: _oauthRequest.default
};
var _default = apis;
exports.default = _default;
//# sourceMappingURL=index.js.map