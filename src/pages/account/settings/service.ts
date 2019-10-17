import request from '@/utils/request';
import { getResult } from '@/utils/networkUtils';
import { CurrentUser } from './data.d';
//获取
// export async function queryCurrent() { 
//   return request('/api/currentUser');
// }

export async function queryCurrent(userid): Promise<CurrentUser> {  
  //return request.get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`, {});  
  //return request(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`); 
  return request.get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`, {}).then(getResult as any); 
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
