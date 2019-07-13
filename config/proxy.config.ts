export interface Proxy {
  [index: string]: {
    target: string;
    changeOrigin?: boolean;
    pathRewrite?: { [index: string]: string };
  };
}

export default {
  '/api': {
    target: 'http://bs.jslesoft.com:8028',
    // target: 'http://172.22.1.224:8080',
  },
} as Proxy;
