// import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
// export function GetTreeJsonById(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetTreeJsonById`, {}).then(getResult);
// }

//获取
export function GetTreeListJson(data): Promise<any> {
  return request
    .get(process.env.basePath + `/Device/GetTreeListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
// export function RemoveForm(keyValue): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Organize/RemoveForm`, { data: objToFormdata({ keyValue }) })
//     .then(getResult as any);
// }

export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Device/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Device/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 验证code
export function ExistEnCode(keyValue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/Device/ExistEnCode?keyValue=${keyValue}&code=${code}`)
    .then(getResult as any);
}

// 验证是否能删除
export function CheckType(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Device/CheckType?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 获取设备分类
export function GetTypes(): Promise<any[]> {
  return request.get(process.env.basePath + `/Device/GetTypes`).then(getResult as any);
}