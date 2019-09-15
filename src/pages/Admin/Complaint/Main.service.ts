 
import { getResult, objToFormdata,ResponseObject } from '@/utils/networkUtils';
import request from '@/utils/request';
// export function GetQuickPStructsTree(): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetQuickPStructsTree`, {})
//     .then(getResult);
// }

export function GetQuickSimpleTreeAll(): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {});
} 

//获取投诉单
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

 
// 新增修改
// export function SaveForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Complaint/SaveForm`, { data: objToFormdata(data) })
//     .then(getResult as any);
// }

// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// Handle
export function Handle(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/Handle`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// Approve
export function Approve(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/Approve`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// Visit
export function Visit(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/Visit`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// Project
export function Project(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/Project`, { data: objToFormdata(data) })
    .then(getResult as any);
}