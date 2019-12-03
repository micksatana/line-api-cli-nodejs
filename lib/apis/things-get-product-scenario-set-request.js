import '../typedef';
import ThingsRequest from './things-request';

/**
 * Get the scenario set registered under a product.
 */
export default class ThingsGetProductScenarioSetRequest extends ThingsRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/products`;
  }

  /**
   * @param {string} productId Product ID
   * @return {Promise<import('axios').AxiosResponse<GetProductScenarioSetResponseData>>}
   */
  send(productId) {
    return this.axios.get(`${this.endpoint}/${productId}/scenario-set`);
  }
}
