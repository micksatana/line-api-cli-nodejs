"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _terminalKit = require("terminal-kit");

var _os = require("os");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ImageHelper {
  static async draw(imageName) {
    const imagePath = _path.default.resolve(__dirname, `../assets/${imageName}.png`);

    console.log(_os.EOL);

    try {
      await _terminalKit.terminal.drawImage(imagePath);
    } catch (error) {}

    return;
  }

}

exports.default = ImageHelper;
//# sourceMappingURL=image-helper.js.map