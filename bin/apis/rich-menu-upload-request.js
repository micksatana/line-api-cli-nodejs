"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _richMenuRequest = _interopRequireDefault(require("./rich-menu-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RichMenuUploadRequest extends _richMenuRequest.default {
  constructor(options) {
    super(_objectSpread({}, options, {}, {
      contentType: 'image/jpeg'
    }));
  }

  send(richMenuId, imagePath) {
    return new Promise((resolve, reject) => {
      const readStream = _fs.default.createReadStream(imagePath);

      _fs.default.stat(imagePath, (err, stats) => {
        if (err) {
          return reject(err);
        }

        this.axios.defaults.headers.common['content-length'] = stats.size;
        return resolve(this.axios.post(`https://api.line.me/v2/bot/richmenu/${richMenuId}/content`, readStream));
      });
    });
  }

}

exports.default = RichMenuUploadRequest;
//# sourceMappingURL=rich-menu-upload-request.js.map