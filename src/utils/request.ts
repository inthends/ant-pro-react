/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import settings from 'config/defaultSettings';
import { getToken, logout } from './login';
import { EPROTONOSUPPORT } from 'constants';
import router from 'umi/router';

class ResponseError<D = any> extends Error {
  name: string;
  data: D;
  response: Response;
  constructor(res) {
    super();
    const { name, data, response } = res;
    this.name = name;
    this.data = data;
    this.response = response;
  }
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response = {} as Response } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // 请求非200时取消后续处理
  return false;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 判断是否开启 sso 登录
 * 需要后端接口配合
 */
if (settings.sso) {
  request.interceptors.request.use((url, options) => {
    const { headers = {} } = options;
    let newHeaders = headers;
    if (!url.includes('/login/signIn')) {
      const accessToken = localStorage.getItem('access_token');
      const Authorization = `bearer ${accessToken}`;
      newHeaders = { ...headers, Authorization };
    }
    headers['x-requested-with'] = 'XMLHttpRequest';
    return {
      url,
      options: {
        ...options,
        headers: newHeaders,
      },
    };
  });

  // @ts-ignore
  request.interceptors.response.use(async (response) => {
    const { status, headers } = response;
    if (status === 403) {
      const redirect = headers.get('redirect') || '';
      window.location.href = redirect;
    } else if (status === 200) {
      const { code, msg } = await response.clone().json();
      if (code !== 200) {
        notification.error({
          message: `请求错误`,
          description: msg,
        });
      }
    } else {
      throw new ResponseError({
        name: status,
        data: '',
        response: response,
      });
    }
    return response;
  });
} else {
  request.interceptors.request.use((url, options) => {
    const { headers, ...restOpts } = options;
    return {
      url,
      options: {
        ...restOpts,
        headers: {
          ...headers,
          TOKEN: getToken(),
        } as any,
      },
    };
  });

  // @ts-ignore
  request.interceptors.response.use(async response => {
    const { code } = await response.clone().json();
    if (code === 401) {
      logout();
    }
    return response;
  });
}

export default request;

// const refreshToken = () => {
//   return request.post(process.env.basePath + '/api/inter/queryInterList', {
//     data: {
//       clientId: 'apiDoc',
//       clientSecret: 'apiDoc',
//       refreshToken: localStorage.getItem('refresh_token'),
//     },
//   }).then(({ tokenInfo: { access_token, refresh_token } }) => {
//     localStorage.setItem('access_token', access_token);
//     localStorage.setItem('refresh_token', refresh_token);
//     return Promise.resolve();
//   });
// };
