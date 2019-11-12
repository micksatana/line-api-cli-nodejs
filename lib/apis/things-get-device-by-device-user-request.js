import ThingsRequest from './things-request';

export default class ThingsGetDeviceByDeviceUserRequest extends ThingsRequest {
  constructor(options) {
    super(options);
  }

  /**
   *
   * @param {string} deviceId Device ID
   * @param {string} userId User ID
   */
  send(deviceId, userId) {
    return this.axios.get(
      `${this.endpoint}/devices/${deviceId}/users/${userId}/links`
    );
  }
}
