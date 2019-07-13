import router from 'umi/router';

/**
 * 获取 token
 *
 */
export const getToken = () => localStorage.getItem('token');

/**
 * 清除 token
 */
export const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

/**
 * 登录
 * @param {*} token
 */
export const login = token => localStorage.setItem('token', token);
