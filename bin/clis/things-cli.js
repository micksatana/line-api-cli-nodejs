#!/usr/bin/env node
"use strict";

var _colors = _interopRequireDefault(require("colors"));

var _operation = _interopRequireDefault(require("../operations/operation"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_colors.default.setTheme(_theme.default);

if (_operation.default.config) {
  const ThingsCommand = require('../commands/things-command').default;

  ThingsCommand.cli();
}
//# sourceMappingURL=things-cli.js.map