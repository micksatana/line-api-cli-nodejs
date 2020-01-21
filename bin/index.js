"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _liffAddRequest = _interopRequireDefault(require("./apis/liff-add-request"));

var _liffListRequest = _interopRequireDefault(require("./apis/liff-list-request"));

var _liffRemoveRequest = _interopRequireDefault(require("./apis/liff-remove-request"));

var _liffRequest = _interopRequireDefault(require("./apis/liff-request"));

var _linetvGetCategoryRequest = _interopRequireDefault(require("./apis/linetv-get-category-request"));

var _linetvListCatagoryRequest = _interopRequireDefault(require("./apis/linetv-list-catagory-request"));

var _linetvGetSportlightRequest = _interopRequireDefault(require("./apis/linetv-get-sportlight-request"));

var _linetvListModulesRequest = _interopRequireDefault(require("./apis/linetv-list-modules-request"));

var _linetvRankingRequest = _interopRequireDefault(require("./apis/linetv-ranking-request"));

var _linetvRequest = _interopRequireDefault(require("./apis/linetv-request"));

var _oauthIssueTokenRequest = _interopRequireDefault(require("./apis/oauth-issue-token-request"));

var _oauthRequest = _interopRequireDefault(require("./apis/oauth-request"));

var _oauthRevokeTokenRequest = _interopRequireDefault(require("./apis/oauth-revoke-token-request"));

var _richMenuAddRequest = _interopRequireDefault(require("./apis/rich-menu-add-request"));

var _richMenuListRequest = _interopRequireDefault(require("./apis/rich-menu-list-request"));

var _richMenuRemoveRequest = _interopRequireDefault(require("./apis/rich-menu-remove-request"));

var _richMenuRequest = _interopRequireDefault(require("./apis/rich-menu-request"));

var _richMenuSetDefaultRequest = _interopRequireDefault(require("./apis/rich-menu-set-default-request"));

var _richMenuUploadRequest = _interopRequireDefault(require("./apis/rich-menu-upload-request"));

var _thingsAddTrialRequest = _interopRequireDefault(require("./apis/things-add-trial-request"));

var _thingsGetDeviceByDeviceUserRequest = _interopRequireDefault(require("./apis/things-get-device-by-device-user-request"));

var _thingsGetDeviceRequest = _interopRequireDefault(require("./apis/things-get-device-request"));

var _thingsGetDevicesByProductUserRequest = _interopRequireDefault(require("./apis/things-get-devices-by-product-user-request"));

var _thingsGetProductScenarioSetRequest = _interopRequireDefault(require("./apis/things-get-product-scenario-set-request"));

var _thingsListTrialProductsRequest = _interopRequireDefault(require("./apis/things-list-trial-products-request"));

var _thingsRemoveProductScenarioSetRequest = _interopRequireDefault(require("./apis/things-remove-product-scenario-set-request"));

var _thingsRemoveTrialProductRequest = _interopRequireDefault(require("./apis/things-remove-trial-product-request"));

var _thingsRequest = _interopRequireDefault(require("./apis/things-request"));

var _thingsUpdateProductScenarioSetRequest = _interopRequireDefault(require("./apis/things-update-product-scenario-set-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apis = {
  LIFFAddRequest: _liffAddRequest.default,
  LIFFListRequest: _liffListRequest.default,
  LIFFRemoveRequest: _liffRemoveRequest.default,
  LIFFRequest: _liffRequest.default,
  LINETvGetCategoryRequest: _linetvGetCategoryRequest.default,
  LINETvGetSpotlightRequest: _linetvGetSportlightRequest.default,
  LINETvListCategoryRequest: _linetvListCatagoryRequest.default,
  LINETvListModulesRequest: _linetvListModulesRequest.default,
  LINETvRankingRequest: _linetvRankingRequest.default,
  LINETvRequest: _linetvRequest.default,
  OAuthIssueTokenRequest: _oauthIssueTokenRequest.default,
  OAuthRequest: _oauthRequest.default,
  OAuthRevokeTokenRequest: _oauthRevokeTokenRequest.default,
  RichMenuAddRequest: _richMenuAddRequest.default,
  RichMenuListRequest: _richMenuListRequest.default,
  RichMenuRemoveRequest: _richMenuRemoveRequest.default,
  RichMenuRequest: _richMenuRequest.default,
  RichMenuSetDefaultRequest: _richMenuSetDefaultRequest.default,
  RichMenuUploadRequest: _richMenuUploadRequest.default,
  ThingsAddTrialRequest: _thingsAddTrialRequest.default,
  ThingsGetDeviceByDeviceUserRequest: _thingsGetDeviceByDeviceUserRequest.default,
  ThingsGetDeviceRequest: _thingsGetDeviceRequest.default,
  ThingsGetDevicesByProductUserRequest: _thingsGetDevicesByProductUserRequest.default,
  ThingsGetProductScenarioSetRequest: _thingsGetProductScenarioSetRequest.default,
  ThingsListTrialProductsRequest: _thingsListTrialProductsRequest.default,
  ThingsRemoveProductScenarioSetRequest: _thingsRemoveProductScenarioSetRequest.default,
  ThingsRemoveTrialProductRequest: _thingsRemoveTrialProductRequest.default,
  ThingsRequest: _thingsRequest.default,
  ThingsUpdateProductScenarioSetRequest: _thingsUpdateProductScenarioSetRequest.default
};
var _default = apis;
exports.default = _default;
//# sourceMappingURL=index.js.map