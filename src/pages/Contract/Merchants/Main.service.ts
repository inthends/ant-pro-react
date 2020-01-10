 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Merchants/GetPageListJson`, { data: objToFormdata(data) }).then(getResult as any);
}

// 保存
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Merchants/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
 

// 获取信息
export function GetFormJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Merchants/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 提交跟进
export function SaveFollow(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Merchants/SaveFollow`, { data: objToFormdata(data) })
    .then(getResult as any);
}

export function GetFollow(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Merchants/GetFollow?keyValue=${keyValue}`)
    .then(getResult as any);
}

//刷新跟进
export function RefreshFollow(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Merchants/RefreshFollow?keyValue=${keyValue}`)
    .then(getResult as any);
}