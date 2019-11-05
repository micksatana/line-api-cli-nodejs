import ThingsRequest from './things-request';

export default class ThingsListTrialProductsRequest extends ThingsRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/trial/products`;
  }

  send() {
    return this.axios.get(this.endpoint);
  }
}
