"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _package = require("../../package.json");

class Command {
  static get versionText() {
    return `LINE API CLIs v${_package.version}`;
  }

}

exports.default = Command;
//# sourceMappingURL=command.js.map