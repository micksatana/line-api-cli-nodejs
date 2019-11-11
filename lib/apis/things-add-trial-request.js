import ThingsRequest from './things-request';

export default class ThingsAddTrialRequest extends ThingsRequest {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }

  /**
   *
   * @param {string} liffId LIFF ID
   * @param {string} name Product name
   */
  send(liffId, name) {
    return this.axios.post(this.endpoint, JSON.stringify({ liffId, name }));
  }
}
