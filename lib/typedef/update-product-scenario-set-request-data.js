/**
 * @typedef UpdateProductScenarioSetRequestData
 * @property {boolean} autoClose
 *  Specifies whether LINE should disconnect from the device after any scenario in the scenario set finishes running.
 *  If `false`, the connection is maintained.
 * @property {number} suppressionInterval
 *  If `autoClose` = `true`, this specifies the time (in milliseconds) before LINE should try to reconnect to the device after automatic disconnection.
 *  Reconnecting after the specified interval is not guaranteed to work.
 *  Depending on the environment in which LINE is running, the reconnection time may vary significantly.
 *  If `autoClose` = `false`, set this to `0`.
 * @property {Array<Scenario>} scenarios
 */
