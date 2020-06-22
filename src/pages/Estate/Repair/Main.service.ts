 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
 
//获取维修单
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//作废
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/InvalidForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}
 
//派单
export function Dispatch(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Dispatch`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//接单
export function Receive(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Receive?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//开工
export function Start(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Start`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//暂停
export function Pause(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Pause`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//处理
export function Handle(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Handle`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//转单
export function Change(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Change`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//检验
export function Check(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Check`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//审核
export function Approve(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Approve`, { data: objToFormdata(data) })
    .then(getResult as any);
}


//获取实体
export function GetEntityByCode(code): Promise<any> {
  return request.get(process.env.basePath + `/Repair/GetEntityByCode?code=${code}`).then(getResult as any);
}


//获取实体
export function GetEntity(keyvalue): Promise<any> {
  return request.get(process.env.basePath + `/Repair/GetEntity?keyvalue=${keyvalue}`).then(getResult as any);
}

//获取图片
export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Repair/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//删除附件
export function RemoveFile(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/RemoveFile?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}
