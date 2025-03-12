import {
  chainsOption,
  impressionsOption,
  investorOption,
  tagsOption,
  tracksOption,
} from '@/utils/interface';
import { RcFile } from 'antd/es/upload';
import request, { reqConfig } from './request';

interface listProjectParams {
  page: number;
  size: number;
  query: string;
  status: number;
  sort_field: string;
  is_asc: boolean;
}

interface briefBasicParams {
  name: string;
  logo_url: string;
  description: string;
}

interface briefProjectParams {
  basic: briefBasicParams;
  related_links: relatedLinksParams[];
}

export interface topProjectItem {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  official_website: string;
}

export interface updateProjectParams {
  id: string;
  completion_status: number;
  basic: basicParams;
  related_links: relatedLinksParams[];
  team: teamParams;
  funding: fundingParams;
  tokenomics: tokenomicsParams;
  ecosystem: ecosystemParams;
  profitability: profitabilityParams;
}

export interface rangeParams {
  min: number;
  max: number;
}

export interface listProjectConditions {
  chains: string[];
  tracks: string[];
  investors: string[];
  market_cap_range: rangeParams | null;
  founded_date_range: rangeParams | null;
}

export interface viewProjectsParams {
  page: number;
  size: number;
  query: string;
  conditions: listProjectConditions;
  sort_field: string;
  is_asc: boolean;
}

export interface restoreProjectParams {
  id: string;
  completion_status: number;
  status: number;
  basic: basicRestoreParams;
  related_links: relatedLinksParams[];
  team: teamRestoreParams;
  funding: fundingRestoreParams;
  tokenomics: tokenomicsParams;
  ecosystem: ecosystemParams;
  profitability: profitabilityParams;
  exchanges?: exchangesParams;
  socials?: socialsParams;
  rank?: number;
}

export interface exchangesParams {
  binance_link: string;
  coinbase_link: string;
  okx_link: string;
}

export interface socialsParams {
  github_commits: number;
  github_contributors: number;
  github_followers: number;
  github_forks: number;
  github_stars: number;
  reddit_followers: number;
  twitter_followers: number;
}

export interface basicRestoreParams {
  name: string;
  logo_url: string;
  description: string;
  chains: chainsOption[];
  tracks: tracksOption[];
  tags: tagsOption[];
  influences: influenceParams[];
  founded_date: string;
  launch_date: string;
  is_open_source: boolean;
  reference: string;
  coin?: coinParams;
}

interface basicParams {
  name: string;
  logo_url: string;
  description: string;
  chains: string[];
  tracks: string[];
  tags: string[];
  influences: influenceParams[];
  founded_date: string;
  launch_date: string;
  is_open_source: boolean;
  reference: string;
  coin?: coinParams;
}

interface coinParams {
  market_cap: number;
  market_cap_ath: number;
  market_cap_cl: number;
  market_cap_rank: number;
  unique_address_number: number;
  up_from_cl: number;
  volume: number;
  active_developer_number: number;
  github_commit_number: number;
  current_price: number;
  current_average_gas_used: number;
}

interface influenceParams {
  type: number;
  detail: string;
  link: string;
}

export interface relatedLinksParams {
  type: string;
  link: string;
}

interface teamParams {
  impressions: string[];
  members: memberParams[];
  reference: string;
}

export interface teamRestoreParams {
  impressions: impressionsOption[];
  members: memberParams[];
  reference: string;
}

export interface memberParams {
  name: string;
  avatar_url: string;
  title: string;
  is_departed: boolean;
  description: string;
  social_media_links: memberLinkParams[];
}

interface memberLinkParams {
  type: string;
  link: string;
}

interface fundingParams {
  top_investors: string[];
  funding_details: fundingDetailsParams[];
  reference: string;
}

export interface fundingRestoreParams {
  top_investors: investorOption[];
  funding_details: fundingDetailsParams[];
  highlights?: highlightsParams;
  reference: string;
}

interface highlightsParams {
  funding_rounds: number;
  investors_number: number;
  large_funding_indexes: number[];
  lead_investors_number: number;
  recent_funding_indexes: number[];
  total_funding_amount: number;
}

export interface fundingDetailsParams {
  round: string;
  date: string;
  amount: number;
  valuation: number;
  investors: string;
  lead_investors: string;
}

export interface tokenomicsParams {
  total_supply?: number;
  token_issuance: boolean;
  token_name: string;
  token_symbol: string;
  token_issuance_date: string;
  initial_distribution_picture_url: string;
  initial_distribution: distributionItem[];
  initial_distribution_source_link: string;
  description: string;
  metrics_link: string;
  metrics_link_logo_url: string;
  holders_link: string;
  holders_link_logo_url: string;
  big_events_link: string;
  big_events_link_logo_url: string;
  reference: string;
}

export interface distributionItem {
  slice: string;
  percentage: number;
}

export interface ecosystemParams {
  total_amount: number;
  growth_curve_picture_url: string;
  growth_curve_source_link: string;
  top_projects: any;
  reference: string;
}

export interface profitabilityParams {
  business_models: businessModelParams[];
  financial_statement_link: string;
  financial_statement_link_logo_url: string;
  reference: string;
}

export interface businessModelParams {
  model: string;
  annual_income: number;
  description: string;
}

export interface metricsParams {
  ids: string;
  type: string;
  start: number;
  end: number;
  interval: string;
}

export async function uploadFile(file: RcFile) {
  const forms = new FormData();
  forms.append('file', file);
  const res = await request({
    headers: {
      token: reqConfig.token,
      'Content-Type': 'multipart/form-data',
    },
    url: `/api/v1/fs/upload`,
    method: 'POST',
    params: {
      type: 1,
    },
    data: forms,
  });
  return res;
}

export async function listProjects(data: listProjectParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/list-edit`,
    method: 'POST',
    data,
  });
  return res;
}

export async function addProject() {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/add`,
    method: 'POST',
    data: {},
  });
  return res;
}

export async function addBriefProject(data: briefProjectParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/add`,
    method: 'POST',
    data,
  });
  return res;
}

export async function updateBriefProject(data: topProjectItem) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/simple-update`,
    method: 'POST',
    data,
  });
  return res;
}

export async function getBriefProject(id: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/simple-info-edit?id=${id}`,
    method: 'GET',
  });
  return res;
}

export async function deleteProject(id: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/delete`,
    method: 'POST',
    data: {
      id,
    },
  });
  return res;
}

export async function getProjectInfo(id: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/info-edit?id=${id}`,
    method: 'GET',
  });
  return res;
}

export async function cmpProjectsInfo(ids: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/info-compare?project-ids=${ids}`,
    method: 'GET',
  });
  return res;
}

export async function metricCompare(metric: metricsParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/metrics-compare?project-ids=${metric.ids}&type=${metric.type}&start-time=${metric.start}&end-time=${metric.end}&interval=${metric.interval}`,
    method: 'GET',
  });
  return res;
}

export async function getProjectDetail(id: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/info-view?id=${id}`,
    method: 'GET',
  });
  return res;
}

export async function updateProject(data: updateProjectParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/update`,
    method: 'POST',
    data,
  });
  return res;
}

export async function publishProject(id: string) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/publish`,
    method: 'POST',
    data: {
      id,
    },
  });
  return res;
}

export async function viewProjects(data: viewProjectsParams) {
  const res = await request({
    headers: {
      token: reqConfig.token,
    },
    url: `/api/v1/project/list-view`,
    method: 'POST',
    data,
  });
  return res;
}
