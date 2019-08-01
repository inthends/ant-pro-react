import { Reducer } from 'redux';
import { query } from '@/services/auth';
import { Effect } from 'dva';

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<any>;
  };
}

export interface AuthModelState {
  authlist?: any[];
}

const AuthModel: AuthModelType = {
  namespace: 'auth',
  state: {
    authlist: undefined,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        authlist: action.payload,
      };
    },
  },
};

export default AuthModel;
