/**
 * @typedef Scenario
 * @property {string} id Scenario ID. Not necessary when creating or updating a scenario set.
 * @property {object} trigger Condition that, when met, starts the scenario.
 * @property {'IMMEDIATE'|'BLE_NOTIFICATION'} trigger.type
 *  `IMMEDIATE`: Perform an action as soon as your device connects to the LINE app.
 *  `BLE_NOTIFICATION`: Perform an action when receiving a notification with the specified GATT characteristic value.
 * @property {string} trigger.serviceUuid 
 *  GATT service UUID (128 bit) that must be in notification.
 *  Set only for `trigger.type = BLE_NOTIFICATION`.
 * @property {string} trigger.characteristicUuid
 *  GATT characteristic UUID (128 bit) that must be in notification.
 *  Set only for `trigger.type = BLE_NOTIFICATION`.
 * @property {Array<ScenarioAction>} actions
 *  Array of Actions action may be empty if the scenario's only purpose is to retrieve notification data.
 * @example
 * ```
 *  {
 *    "trigger": {
 *      "type": "BLE_NOTIFICATION",
 *      "serviceUuid": "4812a0a6-10af-4afb-91f0-b4434e55763b",
 *      "characteristicUuid": "91a6fb1d-d365-4229-9d41-4358a96388e3"
 *    },
 *    "actions": [
 *      {
 *        "type": "SLEEP",
 *        "sleepMillis": 1000
 *      },
 *      {
 *        "type": "GATT_READ",
 *        "serviceUuid": "4812a0a6-10af-4afb-91f0-b4434e55763b",
 *        "characteristicUuid": "91a6fb1d-d365-4229-9d41-4358a96388e3"
 *      },
 *      {
 *        "type": "GATT_WRITE",
 *        "serviceUuid": "4812a0a6-10af-4afb-91f0-b4434e55763b",
 *        "characteristicUuid": "91a6fb1d-d365-4229-9d41-4358a96388e3",
 *        "data": "Zm9vCg=="
 *      }
 *    ]
 *  }
 * ```
 */
