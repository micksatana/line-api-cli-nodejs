"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
const version = () => {
    const pjsonVersion = require('../../package.json').version;
    return `LINE API CLIs v${pjsonVersion}`;
};
exports.version = version;
//# sourceMappingURL=version.js.map