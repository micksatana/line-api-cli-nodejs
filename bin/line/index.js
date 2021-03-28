"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const command_line_args_1 = __importDefault(require("command-line-args"));
const commands_1 = require("./commands");
const draw_1 = require("../draw");
const option_definitions_1 = require("./option-definitions");
const version_1 = require("../version");
const cli = async () => {
    try {
        const { command, _unknown } = command_line_args_1.default([{ name: 'command', defaultOption: true }], { stopAtFirstUnknown: true });
        const argv = _unknown || [];
        const options = command_line_args_1.default(option_definitions_1.optionDefinitions, { argv });
        const line = commands_1.commands();
        if (options.help) {
            if (command) {
                line[command].print();
            }
            else {
                for (const [_, cmd] of Object.entries(line)) {
                    cmd.print();
                }
            }
            process.exit(0);
        }
        if (options.version) {
            console.log(`LINE API CLIs v${version_1.version}`);
            process.exit(0);
        }
        await line[command].command(options);
        return;
    }
    catch (error) {
        await draw_1.drawHelp();
        console.error(error);
        process.exit(1);
    }
};
exports.cli = cli;
//# sourceMappingURL=index.js.map