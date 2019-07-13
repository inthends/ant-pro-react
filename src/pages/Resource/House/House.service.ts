import { PStructsData, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetTreeJsonById(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/PStructs/GetTreeJsonById`, {});
}
export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetStatistics(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/GetStatistics`, { data: objToFormdata(data) })
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
export function GetFormInfoJson(keyValue): Promise<PStructsData> {
  return request
    .get(process.env.basePath + `/PStructs/GetFormInfoJson?keyValue=${keyValue}`)
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 新增修改
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/RemoveForm`, { data: objToFormdata({keyValue}) })
    .then(getResult as any);
}
