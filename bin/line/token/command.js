"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const config_1 = require("../../config");
const safe_1 = require("colors/safe");
const options_1 = require("./options");
const usage_1 = require("./usage");
const command = async (options) => {
    if (!options ||
        (options.issue !== true &&
            options.revoke !== true &&
            options.verify !== true)) {
        usage_1.print();
        console.log(safe_1.red('Required --issue, --revoke or --verify'));
        process.exit(0);
    }
    const config = config_1.loadConfig();
    if (!config.channel.id) {
        console.log(safe_1.yellow('Channel ID not found'));
        console.log(safe_1.green(`Setup channel ID at ${safe_1.white(config_1.CONFIG_FILE_NAME)} and re-run again`));
        process.exit(0);
    }
    if (!config.channel.secret) {
        console.log(safe_1.yellow('Channel secret not found'));
        console.log(safe_1.green(`Setup channel secret at ${safe_1.white(config_1.CONFIG_FILE_NAME)} and re-run again`));
        process.exit(0);
    }
    if (options.issue === true) {
        return options_1.issue();
    }
    else if (options.revoke === true) {
        return options_1.revoke();
    }
    else {
        return options_1.verify();
    }
};
exports.command = command;
//# sourceMappingURL=command.js.map