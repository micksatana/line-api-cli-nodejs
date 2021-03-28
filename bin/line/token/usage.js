"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.usage = void 0;
const safe_1 = require("colors/safe");
const os_1 = require("os");
const print_usage_1 = require("../print-usage");
exports.usage = [
    {
        header: safe_1.green('Issue/Revoke/Verify access token '),
        content: 'After channel ID and secret are configured. Issue a channel access token' +
            os_1.EOL +
            os_1.EOL +
            safe_1.cyan(`line token --issue`) +
            os_1.EOL +
            os_1.EOL +
            `To revoke an access token,` +
            os_1.EOL +
            os_1.EOL +
            safe_1.cyan(`line token --revoke`) +
            os_1.EOL +
            os_1.EOL +
            `To verify an access token,` +
            os_1.EOL +
            os_1.EOL +
            safe_1.cyan(`line token --verify`)
    },
    {
        header: 'Options',
        optionList: [
            {
                name: safe_1.cyan('issue'),
                typeLabel: ' ',
                description: 'Issue a channel access token from pre-configured channel ID and secret'
            },
            {
                name: safe_1.cyan('revoke'),
                typeLabel: ' ',
                description: 'Revoke a channel access token.'
            },
            {
                name: safe_1.cyan('verify'),
                typeLabel: ' ',
                description: 'Verify a channel access token.'
            }
        ]
    }
];
exports.print = print_usage_1.printUsage(exports.usage);
//# sourceMappingURL=usage.js.map