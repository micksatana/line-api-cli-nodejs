"use strict";

var _colors = _interopRequireDefault(require("colors"));

var _os = require("os");

var _imageHelper = _interopRequireDefault(require("./image-helper"));

var _theme = _interopRequireDefault(require("./theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function run() {
  _colors.default.setTheme(_theme.default);

  await _imageHelper.default.draw('chick-face');
  console.log(_os.EOL + `Run ${'line init'.code} to initialize project configuration file.`.help + _os.EOL);
}

run();
//# sourceMappingURL=postinstall.js.map