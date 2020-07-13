// import { BaseRespBean } from '@/model/models';
import request from '@/utils/request';
import { getResult, objToFormdata } from '@/utils/networkUtils';
// import md5 from 'blueimp-md5';
//前端人才公寓申请资料填报
// export function SaveForm(data): Promise<any> { 
//   return request
//     .post(process.env.basePath + `/Apartment/SaveForm`, { data:objToFormdata(data) })
//     .then(getResult as any);
// }

// export const register = (data): Promise<BaseRespBean> => {
//   return request.post(process.env.basePath + '/UserApp/SaveForm', {
//     data,
//   });
// };

//注册
export const register = (data): Promise<any> => {
  return request.post(process.env.basePath + '/Apartment/Register', { data: objToFormdata(data) }).then(getResult as any);
};

// 获取信息
// export function GetFormInfoJson(keyvalue): Promise<any> {
//   return request
//     .get(process.env.basePath + `/Apartment/GetFormInfoJson?keyvalue=${keyvalue}`)
//     .then(getResult as any);
// }
