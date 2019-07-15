import { ParkingData, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetQuickPublicAreaTree(): Promise<any[]> {
  return request
    .get(process.env.basePath + `/ParkingLot/GetQuickParkingTree`, {})
    .then(getResult);
}
export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetPublicAreas(data): Promise<any> {
  return request
    .post(process.env.basePath + `/ParkingLot/GetStatistics`, { data: objToFormdata(data) })
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
export function GetDetailJson(keyValue): Promise<ParkingData> {
  return request
    .get(process.env.basePath + `/ParkingLot/GetFormInfoJson?keyValue=${keyValue}`)
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PublicArea/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/ParkingLot/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}