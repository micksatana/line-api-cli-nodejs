import ThingsOperation from '../things-operation';

describe('ThingsOperation', () => {
  describe('productsToTableData', () => {
    const product = {
      id: '6599589184779863991',
      name: 'Test 2',
      type: 'BLE',
      channelId: 1600202838,
      actionUri: 'line://app/1600202838-Ad4zPrEd',
      serviceUuid: 'ca0248a8-6cdc-4ac3-bd1c-1ad9c84859f0',
      psdiServiceUuid: 'e625601e-9e55-4597-a598-76018a0d293d',
      psdiCharacteristicUuid: '26e2b12b-85f0-4f3f-9fdd-91d114270e6e'
    };
    it('convert to table data', () => {
      const row = {};
      row['ID'.success] = product.id;
      row['Name'.success] = product.name;
      row['Type'.success] = product.type;
      row['Channel ID'.success] = product.channelId;
      row['Service UUID'.success] = product.serviceUuid;
      row['PSDI Service UUID'.success] = product.psdiServiceUuid;
      row['PSDI Characteristic UUID'.success] = product.psdiCharacteristicUuid;
      expect(ThingsOperation.productsToTableData([product])).toEqual([row]);
    });
  });
});
