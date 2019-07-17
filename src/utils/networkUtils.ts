import {ResponseObject} from '@/model/responseObject';

export function objToUrl(data) {
  let url = '';
  for (let k in data) {
    let value = data[k] != undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}

export function objToFormdata(data): FormData {
  let formData = new FormData();
  for (let k in data) {
    let value = data[k] != undefined ? data[k] : '';
    if(isType(value) ==='Object'){
      formData.append(k, JSON.stringify(value));
    } else {
      formData.append(k, value);
    }
    
  }
  return formData;
}

function isType(obj){
  var type = Object.prototype.toString.call(obj);
  if(type == '[object Array]'){
         return 'Array';
   }else if(type == '[object Object]'){
         return "Object"
   }else{
         return 'param is no object type';
   }
}
export function deepCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

export function getResult<T = any>(data: ResponseObject<T>): T | Promise<any>{
  if(data.code === 200) {
    return <T>data.data;
  } else {
    return Promise.reject(data.msg);
  }
}