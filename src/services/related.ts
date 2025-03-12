import { investorAddParams, investorUpdateParams } from '@/utils/interface';
import request, { reqConfig } from './request';


export async function listChains() {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/chain/list`,
    method: 'GET',
  })
  return res;
}

export async function listTracks(is_hot?: boolean) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/track/list${is_hot ? '?page=1&size=20&is_hot=true' : ''}`,
    method: 'GET',
  })
  return res;
}

export async function listTags() {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/tag/list`,
    method: 'GET',
  })
  return res;
}

export async function listImpressions() {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/team-impression/list`,
    method: 'GET',
  })
  return res;
}

export async function addImpressions(data: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/team-impression/add`,
    method: 'POST',
    data: {
      name: data,
      description: data,
    }
  })
  return res;
}


export async function listInvestors(page?: number, size?: number) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/investor/list?page=${page || 1}&size=${size || 20}`,
    method: 'GET',
  })
  return res;
}

export async function addNewTag(tag: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/tag/add`,
    method: 'POST',
    data: {
      name: tag,
      description: tag,
      score: 19,
    }
  })
  return res;
}

export async function addNewInvestor(data: investorAddParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/investor/add`,
    method: 'POST',
    data,
  })
  return res;
}

export async function updateInvestor(data: investorUpdateParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/misc/investor/update`,
    method: 'POST',
    data,
  })
  return res;
}