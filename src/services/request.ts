import axios, { AxiosRequestConfig } from 'axios';

export const reqConfig = {
  token: '',
};

export default async function request(options: AxiosRequestConfig) {
  const session = sessionStorage.getItem('session');
  const netConfig = await fetch('/network.json');
  const netJson = (await netConfig.json()) as any;
  const service = axios.create({
    baseURL: netJson.server,
  });
  // request拦截器
  service.interceptors.request.use(
    (config) =>
      // 在发送请求之前做些什么
      config,
    (error) => {
      // 对请求错误做些什么
      Promise.reject(error);
    },
  );
  // 添加响应拦截器
  service.interceptors.response.use(
    (response) =>
      // 对响应数据做点什么
      response,
    (error) =>
      // 对响应错误做点什么
      Promise.reject(error),
  );
  let response;

  const parseValue = JSON.parse(session || '{}');
  try {
    response = await service({
      ...options,
      headers: { token: parseValue.token },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject(response.data);
    }
  } catch (err) {
    return response;
  }
}
