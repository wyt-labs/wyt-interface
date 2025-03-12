import { onChatParams } from '@/utils/interface';
import request, { reqConfig } from './request';
import okxRequest from '@/services/okxRequest';
import axios from 'axios';

export async function createChat(data) {
  const res = await request({
    url: `/api/v1/chat/create`,
    method: 'POST',
    data,
  });
  return res;
}

export async function listChats() {
  const res = await request({
    url: `/api/v1/chat/list`,
    method: 'GET',
  });
  return res;
}

export async function editChatTitle(id: string, title: string) {
  const res = await request({
    url: `/api/v1/chat/update`,
    method: 'POST',
    data: {
      id,
      title,
    },
  });
  return res;
}

export async function deleteChat(id: string) {
  const res = await request({
    url: `/api/v1/chat/delete`,
    method: 'POST',
    data: {
      id,
    },
  });
  return res;
}

export async function getChatHistory(id: string) {
  const res = await request({
    url: `/api/v1/chat/history?id=${id}`,
    method: 'GET',
  });
  return res;
}

export async function onChat(data: onChatParams) {
  const res = await request({
    url: `/api/v1/chat/completions`,
    method: 'POST',
    data,
  });
  return res;
}

export async function pinAgent(data: any) {
  const res = await request({
    url: `/api/v1/agent/pin`,
    method: 'POST',
    data,
  });
  return res;
}

export async function unpinAgent(data: any) {
  const res = await request({
    url: `/api/v1/agent/unpin`,
    method: 'POST',
    data,
  });
  return res;
}

export async function getAgentList() {
  const res = await request({
    url: `/api/v1/agent/list`,
    method: 'GET',
  });
  return res;
}

export async function getChains() {
  return okxRequest({
    url: `/api/v1/dex/aggregator/supported/chain`,
    method: 'get',
    // data: {chainId: 1}
  });
}

// api/v5/dex/cross-chain/supported/tokens

export async function getTokens(chainId?: number) {
  return okxRequest({
    url: `/api/v1/dex/aggregator/all-tokens`,
    method: 'get',
    data: { chainId },
  });
}

export async function getSupportTokens(fromChainId?: number, tokens: any[]) {
  const res = await okxRequest({
    url: `/api/v1/dex/cross-chain/supported/bridge-tokens-pairs`,
    method: 'get',
    data: { fromChainId },
  });
  if (tokens?.length) {
    return tokens.filter((x) =>
      res.some((y) => y.fromTokenAddress === x.tokenContractAddress),
    );
  }

  return tokens;
}

export async function getLiquidity(chainId) {
  return okxRequest({
    url: `/api/v1/dex/aggregator/get-liquidity`,
    method: 'get',
    data: { chainId },
  });
}

// /api/v1/dex/aggregator/quote

export async function getQuote(data) {
  return okxRequest({
    url: `/api/v1/dex/aggregator/quote`,
    method: 'get',
    data,
  });
}

export async function getCurrentPrice(instId: string) {
  return okxRequest({
    url: `/api/v1/dex/token/price?tokenSymbol=${instId?.toLowerCase()}`,
    method: 'get',
    // data,
  });
}

export async function getCrossChain(data) {
  return okxRequest({
    url: `/api/v1/dex/cross-chain/quote`,
    method: 'get',
    data,
  });
}

// /api/v1/wallet/post-transaction/transaction-detail-by-txhash

export async function getTransactionByHash(data) {
  return okxRequest({
    url: `/api/v1/wallet/post-transaction/transaction-detail-by-txhash`,
    method: 'get',
    data,
  });
}

export async function getSwap(data) {
  return okxRequest({
    url: `/api/v1/dex/aggregator/swap`,
    method: 'get',
    data,
  });
}

const jsonToUrlEncode = (data: any) =>
  Object.entries(data)
    // .filter((item) => item[1] !== undefined)
    .map((res: any) => `${res[0]}=${window.encodeURIComponent(res[1])}`)
    .join('&');

export async function getPumpToken(data) {
  const res = await request({
    url: `/api/v1/data/pump/new-tokens?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });
  return res.data;
}

// api/v1/data/pump/launch-time
export async function getPumpLaunchTime(data) {
  const res = await request({
    url: `/api/v1/data/pump/launch-time?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}

export async function getPumpTransactions(data) {
  const res = await request({
    url: `/api/v1/data/pump/transactions?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}

export async function getTopTraders(data) {
  const res = await request({
    url: `/api/v1/data/pump/top-traders?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res?.data || [];
}

export async function getTraderInfo(data) {
  const res = await request({
    url: `/api/v1/data/pump/trader/info?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}

export async function getTraderOverview(data) {
  const res = await request({
    url: `/api/v1/data/pump/trader/overview?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}

export async function getTraderProfit(data) {
  const res = await request({
    url: `/api/v1/data/pump/trader/profit?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}

export async function getTraderProfitDistribution(data) {
  const res = await request({
    url: `/api/v1/data/pump/trader/profit-distribution?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}

export async function getTraderList(data) {
  const res = await request({
    url: `/api/v1/data/pump/trader/trades?${jsonToUrlEncode(data)}`,
    method: 'GET',
  });

  return res.data;
}
