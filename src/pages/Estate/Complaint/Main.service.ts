
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
 

//获取投诉单
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 获取投诉对象详细信息
export function GetUserByCustomerId(keyvalue, type): Promise<any> {
  return request
    .get(process.env.basePath + `/ServiceDesk/GetUserByCustomerId?keyvalue=${keyvalue}&type=${type}`)
    .then(getResult as any);
}

// 新增修改
// export function SaveForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Complaint/SaveForm`, { data: objToFormdata(data) })
//     .then(getResult as any);
// }

// 作废
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Complaint/InvalidForm?keyvalue=${keyvalue}`, {})
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

//获取实体
export function GetEntity(keyvalue): Promise<any> {
  return request.get(process.env.basePath + `/Complaint/GetEntity?keyvalue=${keyvalue}`).then(getResult as any);
}


//获取实体
export function GetEntityByCode(code): Promise<any> {
  return request.get(process.env.basePath + `/Complaint/GetEntityByCode?code=${code}`).then(getResult as any);
}

