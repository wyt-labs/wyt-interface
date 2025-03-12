import type { UserModel } from '@/utils/model';

export default {
  namespace: 'chat',
  state: {
    chatList: [],
    agentList: [],
    projectList: {},
  },
  reducers: {
    setChatList(state: UserModel, { payload }: { payload: any[] }) {
      return {
        ...state,
        chatList: payload,
      };
    },

    setProject(state: UserModel, { payload }: { payload: any[] }) {
      return {
        ...state,
        projectList: payload,
      };
    },
    setAgentList(state: UserModel, { payload }: { payload: any[] }) {
      return {
        ...state,
        agentList: payload,
      };
    },
  },
};
