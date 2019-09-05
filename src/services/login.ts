import { objToFormdata, deepCopy } from '@/utils/networkUtils';
import request from '@/utils/request';
import md5 from 'blueimp-md5';

export async function loginService(data: any): Promise<any> {
  let newData = deepCopy(data);
  console.log(md5);
  newData.password = md5(data.password);
  return request.post(process.env.basePath + `/Login/CheckLogin`, {
    data: objToFormdata(newData),
  });
}

// export async function logoutService(params): Promise<any> {
//   return request.get('/logout', { params });
// }

//退出
export async function logoutService(data:any): Promise<any> { 

  return request.get(process.env.basePath + `/Login/Logout?userid=${data.userid}`, { });

}
