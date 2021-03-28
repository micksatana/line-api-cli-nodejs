"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printUsage = void 0;
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const printUsage = (usage) => () => console.log(command_line_usage_1.default(usage));
exports.printUsage = printUsage;
//# sourceMappingURL=print-usage.js.map