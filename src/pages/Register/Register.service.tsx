// import { BaseRespBean } from '@/model/models';
import request from '@/utils/request';
import { getResult, objToFormdata } from '@/utils/networkUtils'; 

//前端人才公寓申请资料填报
export function SaveForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/UserApp/SaveForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

// export const register = (data): Promise<BaseRespBean> => {
//   return request.post(process.env.basePath + '/UserApp/SaveForm', {
//     data,
//   });
// };
