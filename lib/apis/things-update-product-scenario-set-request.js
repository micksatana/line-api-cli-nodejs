import '../typedef';
import ThingsRequest from './things-request';

/**
 * Register (create or update) a scenario set for automatic communication under a product.
 */
export default class ThingsUpdateProductScenarioSetRequest extends ThingsRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/products`;
  }

  /**
   * @param {string} productId Product ID
   * @param {UpdateProductScenarioSetRequestData} data
   * @return {Promise<import('axios').AxiosResponse<UpdateProductScenarioSetResponseData>>}
   */
  send(productId, data) {
    return this.axios.put(`${this.endpoint}/${productId}/scenario-set`, data);
  }
}
