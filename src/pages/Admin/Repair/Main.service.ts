 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetQuickPStructsTree(): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetQuickPStructsTree`, {})
    .then(getResult);
}

//获取维修单
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

 
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PublicArea/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/PublicArea/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
