export interface UserModel {
  isLogin: boolean;
  account: string;
  compares: CompareItem[];
}

export interface CompareItem {
  id: string;
  name: string;
  logo: string;
}

export interface ProjectItem {
  UNISWAP_ID: string;
  WYT_ID: string;
}

export interface ChatModel {
  chatList: any[];
  projectList: ProjectItem;
  agentList: any[];
}
