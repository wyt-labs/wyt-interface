import request, { reqConfig } from './request';

export async function QueryNonce(address: string) {
  const res = await request({
    url: `/api/v1/user/nonce?addr=${address}`,
    method: 'GET',
  });
  return res;
}

export async function LoginWithSignature(signature: string, address: string) {
  const res = await request({
    url: `/api/v1/user/login`,
    method: 'POST',
    data: {
      type: 0,
      addr: address,
      signature,
    }
  });
  return res;
}

export async function RefreshToken() {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/user/refresh-token`,
    method: 'GET',
  });
  return res;
}
