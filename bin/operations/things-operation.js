"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../typedef");

var _operation = _interopRequireDefault(require("./operation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsOperation extends _operation.default {
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
      row['PSDI Characteristic UUID'.success] = product.psdiCharacteristicUuid;
      return row;
    });
  }

}

exports.default = ThingsOperation;
//# sourceMappingURL=things-operation.js.map