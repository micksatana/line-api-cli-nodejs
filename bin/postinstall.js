"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const safe_1 = __importDefault(require("colors/safe"));
const draw_1 = require("./draw");
async function run() {
    await draw_1.drawLogo();
    console.log(os_1.EOL +
        safe_1.default.green(`Run ${safe_1.default.cyan('line init')} to initialize project configuration file.`) +
        os_1.EOL);
}
run();
//# sourceMappingURL=postinstall.js.map