 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Channel/GetPageListJson`, { data: objToFormdata(data) }).then(getResult as any);
}

// 保存
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Channel/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 获取信息
export function GetFormJson(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Channel/GetFormJson?keyvalue=${keyvalue}`)
    .then(getResult as any);
} 