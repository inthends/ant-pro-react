import { loginService, logoutService } from '@/services/login';
import { Effect } from './connect';
import { message } from 'antd';
import router from 'umi/router';
import { login } from '@/utils/login';
import { delay } from 'lodash';

export interface LoginState {
  status: string;
}

export interface LoginModel {
  namespace: 'login';
  state: LoginState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {};
}

export default {
  namespace: 'login',
  state: {
    status: '',
  },
  effects: {
    *login({ payload }, { call }) {
      const data = { ...payload };
      const {
        code,
        msg,
        data: {  token, userid },
      } = yield call(loginService, data);
      if (code === 200) {
        message.success('登陆成功');
        localStorage.setItem('token', token);
        localStorage.setItem('userid', userid);
        login(token);
        delay(() => {
          router.push('/resource');
        }, 500);
      } else {
        message.error(msg);
      }
      return data;
    },
    *logout(_, { call }) {
      const logoutUrl = `${location.protocol}://${location.host}/`;
      yield call(logoutService, { logoutUrl });
    },
  },
  reducers: {
    doLogin(state) {
      return {
        ...state,
        status: 'ok',
      };
    },
  },
} as LoginModel;
