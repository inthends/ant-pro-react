import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
// export function GetOrgTreeOnly(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`, {}).then(getResult);
// }
export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Vendor/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

export function GetTreeAreaJson(id): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/PStructs/GetTreeAreaJson?id=${id}`)
    .then(getResult as any);
}
export function GetProjectType(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/PStructs/GetDataItemTreeJson?EnCode=ProjectType`)
    .then(getResult as any);
}

// 获取房产信息
export function GetFormInfoJson(keyValue): Promise<GmPstructure> {
  return request
    .get(process.env.basePath + `/PStructs/GetFormInfoJson?keyValue=${keyValue}`)
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Vendor/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 新增修改
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Vendor/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Vendor/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}


