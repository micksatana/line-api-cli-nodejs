import axios from 'axios';
import { requestData } from '../common';

const { spyOn } = jest;

describe('requestData', () => {
  test('call request with data', async () => {
    const service = axios.create();
    spyOn(service, 'request').mockResolvedValue('x');
    await expect(
      requestData(service)({ A: 'asdf', J: 'jkl;' })
    ).resolves.toEqual('x');
    expect(service.request).toBeCalledWith({ data: 'A=asdf&J=jkl%3B' });
  });
});
