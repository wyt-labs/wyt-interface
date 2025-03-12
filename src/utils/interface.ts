export interface chainsOption {
  id: string;
  create_time: number;
  update_time: number;
  creator: string;
  name: string;
  logo_url: string;
  description: string;
  base_64_icon?: string;
}

export interface tracksOption {
  id: string;
  create_time: number;
  update_time: number;
  creator: string;
  name: string;
  description: string;
}

export interface tagsOption {
  id: string;
  create_time: number;
  update_time: number;
  creator: string;
  name: string;
  description: string;
}

export interface impressionsOption {
  id: string;
  create_time: number;
  update_time: number;
  creator: string;
  name: string;
  description: string;
}

export interface investorOption {
  id: string;
  create_time: number;
  update_time: number;
  creator: string;
  name: string;
  description: string;
  avatar_url: string;
  subject: number;
  type: number;
  social_media_links: investorLink[];
}

interface investorLink {
  type: string;
  link: string;
}

export interface investorAddParams {
  name: string;
  description: string;
  avatar_url: string;
  subject: number;
  type: number;
  social_media_links: investorLink[];
}

export interface investorUpdateParams {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  subject: number;
  type: number;
  social_media_links: investorLink[];
}

export interface investorDetail {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  subject: number;
  type: number;
  social_media_links: investorLink[];
}

export interface homeTableData {
  chains: chainsOption[];
  create_time: number;
  id: string;
  last_7_days_picture_url: string;
  logo_url: string;
  market_cap: number;
  name: string;
  price: number;
  status: number;
  symbol: string;
  tags: string[];
  total_funding: number;
  tracks: tracksOption[];
  update_time: number;
}

export interface chatListParams {
  create_time: number;
  creator: string;
  id: string;
  msg_num: number;
  title: string;
  update_time: number;
  isSelected: boolean;
  isEdit: boolean;
  isDelete: boolean;
  label?: string;
  editTitle: string;
  isLoading: boolean;
  project_id: number | string;
}

export interface onChatParams {
  id: string;
  type: string;
  msg: string;
}
