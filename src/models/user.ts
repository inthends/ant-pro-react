import { bindUserService, query as queryUsers, queryCurrent } from '@/services/user';
import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  geographic?: any;
  tags?: any[];
  unreadCount?: number;
}

export interface UserModelState {
  list: any[];
  currentUser: CurrentUser;
  // dingdingInfo: any;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    setCurrent: Effect;
    bindUser: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveCurrentUser: Reducer<any>;
    saveDingdingInfo: Reducer<any>;
    changeNotifyCount: Reducer<any>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    list: [],
    currentUser: {},
    // dingdingInfo: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
        const userid = localStorage.getItem('userid'); 
        const { code, data } = yield call(queryCurrent, userid);
        if (code === 200) {
          if (data) {
            yield put({
              type: 'saveCurrentUser',
              payload: data,
            });
          }
        } 
    },

    *setCurrent({ payload }, { call, put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: payload,
      });
    },
    *bindUser({ payload }, { call }) {
      const { user } = payload;
      const { code } = yield call(bindUserService, user);
      return code === 0;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveDingdingInfo(state, action) {
      return {
        ...state,
        dingdingInfo: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
