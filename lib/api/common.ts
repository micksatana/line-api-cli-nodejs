import { AxiosInstance } from 'axios';

export const requestData = <T>(axios: AxiosInstance) => (data: T) => {
  return axios.request({ data });
};
