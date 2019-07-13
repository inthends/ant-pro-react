import { Reducer } from 'redux';
import { queryEnv } from '@/services/env';
import { Effect } from 'dva';

export interface EnvModelType {
  namespace: 'env';
  state: EnvModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<any>;
  };
}

export interface EnvModelState {
  list?: any[];
}

const EnvModel: EnvModelType = {
  namespace: 'env',
  state: {
    list: undefined,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryEnv);
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
        list: action.payload,
      };
    },
  },
};

export default EnvModel;
