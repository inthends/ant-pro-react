// import { ResponseObject } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
 
// export function GetQuickSimpleTreeAll(): Promise<ResponseObject<any[]>> {
//   return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {});
// } 

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

//获取图片
export function GetFilesData(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/ServiceDesk/GetFilesData?keyValue=${keyValue}`)
    .then(getResult as any);
}


// 保存
export function SaveForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/ServiceDesk/SaveForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/ServiceDesk/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

//删除附件
export function RemoveFile(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/ServiceDesk/RemoveFile?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 获取房间住户信息
export function GetRoomUser(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/ServiceDesk/GetRoomUser?keyValue=${keyValue}`)
    .then(getResult as any);
}

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


// 闭单
export function Finish(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/ServiceDesk/Finish`, { data:objToFormdata(data) })
    .then(getResult as any);
}
