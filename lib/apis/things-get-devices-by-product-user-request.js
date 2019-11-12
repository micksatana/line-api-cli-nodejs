import ThingsRequest from './things-request';

export default class ThingsGetDevicesByProductUserRequest extends ThingsRequest {
  constructor(options) {
    super(options);
  }

  /**
   *
   * @param {string} productId Product ID
   * @param {string} userId User ID
   */
  send(productId, userId) {
    return this.axios.get(
      `${this.endpoint}/products/${productId}/users/${userId}/links`
    );
  }
}
