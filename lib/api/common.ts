import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

export const requestData = <T>(axios: AxiosInstance) => (data: T) => {
  return axios.request({ data: stringify(data) });
};
