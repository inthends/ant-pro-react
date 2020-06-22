// import { ResponseObject } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
 
 
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
export function GetCommunicates(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/ServiceDesk/GetCommunicates?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//获取图片
export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/ServiceDesk/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}


// 保存
export function SaveForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/ServiceDesk/SaveForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

// 删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/ServiceDesk/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//删除附件
export function RemoveFile(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/ServiceDesk/RemoveFile?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取房间租户信息
// export function GetRoomUser(keyvalue): Promise<any> {
//   return request
//     .get(process.env.basePath + `/ServiceDesk/GetRoomUser?keyvalue=${keyvalue}`)
//     .then(getResult as any);
// }

// 转报修
export function ChangeToRepair(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/ServiceDesk/ChangeToRepair`, { data:objToFormdata(data) })
    .then(getResult as any);
}

// 转投诉
export function ChangeToComplaint(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/ServiceDesk/ChangeToComplaint`, { data:objToFormdata(data) })
    .then(getResult as any);
}

