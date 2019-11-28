/**
 * @typedef UpdateProductScenarioSetResponseData
 * @property {string} productId Product ID
 * @property {boolean} autoClose
 *  Specifies whether LINE should disconnect from the device after any scenario in the scenario set finishes running.
 *  If `false`, the connection is maintained.
 * @property {number} suppressionInterval
 *  If `autoClose` = `true`, this specifies the time (in milliseconds) before LINE should try to reconnect to the device after automatic disconnection.
 *  Reconnecting after the specified interval is not guaranteed to work.
 *  Depending on the environment in which LINE is running, the reconnection time may vary significantly.
 *  If `autoClose` = `false`, set this to `0`.
 * @property {number} revision Current revision of the scenario set. It is automatically incremented for each change.
 * @property {Array<Scenario>} scenarios
 * @property {string} createdAt Date and time when the scenario set was created. `2019-11-28T15:22:00.52Z`
 * @property {string} updatedAt Date and time when the scenario set was updated. `2019-11-28T15:33:00.52Z`
 */
"use strict";
//# sourceMappingURL=update-product-scenario-set-response-data.js.map