export interface Proxy {
  [index: string]: {
    target: string;
    changeOrigin?: boolean;
    pathRewrite?: { [index: string]: string };
  };
}

export default {
  '/api': {
     //target: 'http://hf.jslesoft.com:8018', 
     target:'http://localhost:52520', 
  },
} as Proxy;
