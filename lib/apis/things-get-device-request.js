import ThingsRequest from './things-request';

export default class ThingsGetDeviceRequest extends ThingsRequest {
  constructor(options) {
    super(options);
  }

  /**
   *
   * @param {string} deviceId Device ID
   */
  send(deviceId) {
    return this.axios.get(
      `${this.endpoint}/devices/${deviceId}`
    );
  }
}
