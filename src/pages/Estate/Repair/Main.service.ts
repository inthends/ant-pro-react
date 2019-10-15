 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
// export function GetQuickPStructsTree(): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetQuickPStructsTree`, {})
//     .then(getResult);
// }

//获取维修单
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
 
//派单
export function Dispatch(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Dispatch`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//接单
export function Receive(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Receive?keyValue=${keyValue}`, {})
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

//回访
export function Visit(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Repair/Visit`, { data: objToFormdata(data) })
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

