export interface Proxy {
  [index: string]: {
    target: string;
    changeOrigin?: boolean;
    pathRewrite?: { [index: string]: string };
  };
}

export default {
  '/api': {
<<<<<<< HEAD
     target: 'http://hf.jslesoft.com:8018',
     //target:'http://localhost:52520',



=======
     //target: 'http://hf.jslesoft.com:8018', 
     target:'http://localhost:52520', 
>>>>>>> a0f198cb27e8a934348854e45404ae68ab753cd0
  },
} as Proxy;
