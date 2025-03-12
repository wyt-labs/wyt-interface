import { message } from 'antd';
import axios from 'axios';
// import crypto from 'crypto';
// import https from 'https'

// 只支持一层简单json格式的对象
const jsonToUrlEncode = (data: any) =>
  Object.entries(data)
    // .filter((item) => item[1] !== undefined)
    .map((res: any) => `${res[0]}=${window.encodeURIComponent(res[1])}`)
    .join('&');
const getParams = (method: string, data: any) => {
  switch (method) {
    case 'get':
      return jsonToUrlEncode(data);
  }
};
//
// const api_config = {
//   api_key: '9fb0b0f8-77dd-47a9-b6b2-76c710668ceb',
//   secret_key: '3C4A92D7CD4FC01B97A04FFC087B8DB1',
//   passphrase: 'Hyperchain123,',
//   project: 'd6f54c92fbb5046f22150819626f827d', // 此处仅适用于 WaaS APIs
// };

// const preHash = (timestamp, method, request_path, params) => {
//   // 根据字符串和参数创建预签名
//   let query_string = '';
//   if (method === 'GET' && params) {
//     query_string = '?' + jsonToUrlEncode(params);
//   }
//   if (method === 'POST' && params) {
//     query_string = JSON.stringify(params);
//   }
//   return timestamp + method + request_path + query_string;
// };

// const sign = (msg, secret_key) => {
//   // 使用 HMAC-SHA256 对预签名字符串进行签名
//   const hmac = crypto.createHmac('sha256', secret_key);
//   hmac.update(msg);
//   return hmac.digest('base64');
// };

// const createSignature = (method, request_path, params) => {
//   // 获取 ISO 8601 格式时间戳
//   const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
//   // 生成签名
//   const msg = preHash(timestamp, method, request_path, params);
//   const signature = sign(msg, api_config['secret_key']);
//   return { signature, timestamp };
// };

export default async function okxRequest(params: any) {
  const netConfig = await fetch('/network.json');
  const { url, data, method = 'get', ...last } = params;
  // const { signature, timestamp } = createSignature('GET', url, data);

  // f0d413cc60edf43a54272d4f0d05e5ab

  // const headers = {
  //   'OK-ACCESS-KEY': api_config['api_key'],
  //   'OK-ACCESS-SIGN': signature,
  //   'OK-ACCESS-TIMESTAMP': timestamp,
  //   'OK-ACCESS-PASSPHRASE': api_config['passphrase'],
  //   'OK-ACCESS-PROJECT': api_config['project'], // 这仅适用于 WaaS APIs
  // };

  const netJson = (await netConfig.json()) as any;

  const baseApi = netJson.server;
  const new_data = {};
  // eslint-disable-next-line guard-for-in
  for (let key in data) {
    // if (getTrueData(data[key])) new_data[key] = data[key];
    // @ts-ignore
    new_data[key] = data[key];
  }

  const res: any = await axios(
    method === 'get' && data
      ? `${baseApi}${url}?${getParams(method, new_data)}`
      : baseApi + url,
    {
      data,
      method,
      // headers,
      ...last,
    },
  );
  if (res.status === 200 && Number(res?.data?.code) === 0) {
    return res.data.data;
  }

  const { msg } = res.data;
  if (msg) {
    const digitsRegex = /\d+/g;
    const letters = msg.match(digitsRegex) || [];
    if (!letters.length) {
      message.info(msg);
    }
  }

  return Promise.reject(res.data);
}
