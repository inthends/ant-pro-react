import { Reducer } from 'redux';
import { query } from '@/services/app';
import { Effect } from 'dva';
import { ApiApplication } from '@/model/models';

export interface AppModelType {
  namespace: 'app';
  state: AppModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<any>;
  };
}

export interface AppModelState {
  list?: ApiApplication[];
}

const AppModel: AppModelType = {
  namespace: 'app',
  state: {
    list: undefined,
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
        list: action.payload,
      };
    },
  },
};

export default AppModel;
