import type { CompareItem, UserModel } from '@/utils/model';

export default {
  namespace: 'user',
  state: {
    isLogin: false,
    account: '',
    compares: [],
  },
  reducers: {
    setIsLogin(state: UserModel, { payload }: { payload: boolean }) {
      return {
        ...state,
        isLogin: payload,
      };
    },
    setAccount(state: UserModel, { payload }: { payload: string }) {
      return {
        ...state,
        account: payload,
      };
    },
    setCompares(state: UserModel, { payload }: { payload: CompareItem[] }) {
      return {
        ...state,
        compares: payload,
      };
    },
  },
};
