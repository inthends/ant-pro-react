import { objToFormdata, deepCopy } from '@/utils/networkUtils';
import request from '@/utils/request';
import * as md5 from 'blueimp-md5';

export async function loginService(data: any): Promise<any> {
  let newData = deepCopy(data);
  newData.password = md5(data.password);
  return request.post(process.env.basePath + `/Login/CheckLogin`, {
    data: objToFormdata(newData),
  });
}

export async function logoutService(params): Promise<any> {
  return request.get('/logout', { params });
}
