import {  ResponseObject } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetQuickPStructsTree(): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetQuickPStructsTree`, {})
    .then(getResult);
}

export function GetQuickSimpleTreeAll(): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {});
} 
 

//获取服务单
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/ServiceDesk/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 提交评论
export function SendCommunicate(data): Promise<any> {
  return request
    .post(process.env.basePath + `/ServiceDesk/SendCommunicate`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//获取评论
export function GetCommunicates(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/ServiceDesk/GetCommunicates?keyValue=${keyValue}`)
    .then(getResult as any);
}