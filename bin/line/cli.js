"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const init_1 = require("./operation/init");
const token_1 = require("./operation/token");
const safe_1 = __importDefault(require("colors/safe"));
const command_line_args_1 = __importDefault(require("command-line-args"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const draw_1 = require("../draw");
const version_1 = require("../version");
const cli = async () => {
    try {
        const { operation, _unknown } = command_line_args_1.default([{ name: 'operation', defaultOption: true }], { stopAtFirstUnknown: true });
        const argv = _unknown || [];
        const options = command_line_args_1.default([
            { name: 'help', alias: 'h', type: Boolean },
            { name: 'version', alias: 'v', type: Boolean },
            { name: 'issue', type: Boolean },
            { name: 'revoke', type: Boolean }
        ], { argv });
        if (options.help) {
            await draw_1.drawHelp();
            switch (operation) {
                case 'init':
                    console.log(command_line_usage_1.default(init_1.InitUsage));
                    break;
                case 'token':
                    console.log(command_line_usage_1.default(token_1.TokenUsage));
                    break;
                default:
                    console.log(command_line_usage_1.default([...init_1.InitUsage, ...token_1.TokenUsage]));
            }
            process.exit(0);
        }
        if (options.version) {
            await draw_1.drawHelp();
            console.log(version_1.version());
            process.exit(0);
        }
        if (operation === 'init') {
            await init_1.init(options);
        }
        else if (operation === 'token') {
            await token_1.token(options);
        }
        else {
            await draw_1.drawHelp();
            console.log(safe_1.default.yellow(`Unknown operation: ${safe_1.default.cyan(operation || 'undefined')}`));
        }
        return;
    }
    catch (error) {
        await draw_1.drawHelp();
        console.error(error);
        process.exit(1);
    }
};
exports.cli = cli;
//# sourceMappingURL=cli.js.map