import '../typedef';

import Operation from './operation';

export default class ThingsOperation extends Operation {
  /**
   * @param {Array<TrialProductData>} products
   * @return {Array<{[prop:string]: string|number}>}
   */
  static productsToTableData(products) {
    return products.map(product => {
      const row = {};

      row['ID'.success] = product.id;
      row['Name'.success] = product.name;
      row['Type'.success] = product.type;
      row['Channel ID'.success] = product.channelId;
      row['Service UUID'.success] = product.serviceUuid;
      row['PSDI Service UUID'.success] = product.psdiServiceUuid;
      row['PSDI Characteristic UUID'.success] =
        product.psdiCharacteristicUuid;

      return row;
    });
  }
}
