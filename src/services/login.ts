import { objToFormdata, deepCopy } from '@/utils/networkUtils';
import request from '@/utils/request';
import md5 from 'blueimp-md5';

export async function loginService(data: any): Promise<any> {
  let newData = deepCopy(data);
  //console.log(md5);
  newData.password = md5(data.password);

  // console.log(process.env.basePath);
  // //从中间配置库获取真正接口地址
  // // let url = 'http://hf.jslesoft.com:8008/System/GetSystemInfo?usercode=${data.usercode}';
  // let url = 'http://localhost:5000/api/System/GetSystemInfo?usercode=${data.usercode}'; 
  // request.get(url, {
  // }).then((res) => {
  //   process.env.basePath = res.serverUrl;
  // });

  //test 
  // return request.post('http://jstc.jslesoft.com/api/MobileMethod/LKLPayNotify', {
  //   data: objToFormdata(newData),
  // });

  return request.post(process.env.basePath + `/Login/CheckLogin`, {
    data: objToFormdata(newData),
  });
}

// export async function logoutService(params): Promise<any> {
//   return request.get('/logout', { params });
// }

//退出
export async function logoutService(data: any): Promise<any> {
  return request.get(process.env.basePath + `/Login/Logout?userid=${data.userid}`, {});
}
