/**
 * @typedef ScenarioAction
 * @property {'SLEEP'|'GATT_READ'|'GATT_WRITE'} type
 *  `SLEEP`: Wait for a specified period of time.
 *  `GATT_READ`: Read data from the specified GATT characteristic value.
 *  `GATT_WRITE`: Write data to the specified GATT characteristic value.
 * @property {number} sleepMillis
 *  Time to spend in `SLEEP`
 *  It is not guaranteed that `SLEEP` will end after the specified time.
 *  Depending on the environment in which LINE is running, the time may vary significantly.
 *  Set this property only when `actions[].type` is `SLEEP`.
 * @property {string} serviceUuid
 *  GATT service UUID (128 bit) including GATT characteristic that reads and writes data
 *  Set this property only when `actions[].type` is `GATT_READ` or `GATT_WRITE`.
 * @property {string} characteristicUuid
 *  GATT service characteristic (128 bit) that reads and writes data
 *  Set this property only when `actions[].type` is `GATT_READ` or `GATT_WRITE`.
 * @property {string} data
 *  Base64 encoded data
 *  Set this property only when `actions[].type` is `GATT_WRITE`.
 */
