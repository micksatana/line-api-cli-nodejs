import '../typedef';
import ThingsRequest from './things-request';

/**
 * Delete a scenario set registered under a product
 */
export default class ThingsRemoveProductScenarioSetRequest extends ThingsRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/products`;
  }

  /**
   * @param {string} productId Product ID
   * @return {Promise<import('axios').AxiosResponse>}
   */
  send(productId) {
    return this.axios.delete(`${this.endpoint}/${productId}/scenario-set`);
  }
}
