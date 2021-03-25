"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawHelp = exports.drawLogo = exports.draw = void 0;
const os_1 = require("os");
const path_1 = require("path");
const terminal_kit_1 = require("terminal-kit");
const draw = (imageName) => async () => {
    const imagePath = path_1.resolve(__dirname, `../assets/${imageName}.png`);
    console.log(os_1.EOL);
    try {
        await terminal_kit_1.terminal.drawImage(imagePath);
    }
    catch (error) { }
    return;
};
exports.draw = draw;
exports.drawLogo = exports.draw('chick-face');
exports.drawHelp = exports.draw('chick-helps');
//# sourceMappingURL=draw.js.map