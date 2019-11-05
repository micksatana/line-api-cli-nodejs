import ThingsRequest from './things-request';

export default class ThingsRemoveTrialProductRequest extends ThingsRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/trial/products`;
  }

  /**
   *
   * @param {string} productId Product ID
   */
  send(productId) {
    return this.axios.delete(`${this.endpoint}/${productId}`);
  }
}
