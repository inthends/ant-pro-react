import { ParkingData,   TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

export function GetQuickParkingTree(type): Promise<any[]> {
  return request.get(process.env.basePath + `/ParkingLot/GetQuickParkingTree?type=${type}`, {}).then(getResult);
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
export function SaveGarageForm(data): Promise<any> {
  data.keyValue = data.id;
  return request
    .post(process.env.basePath + `/ParkingLot/SaveGarageForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 新增修改
export function SaveParkingForm(data): Promise<any> {
  data.keyValue = data.id;
  return request
    .post(process.env.basePath + `/ParkingLot/SaveParkingForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/ParkingLot/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
// export function getTreeData(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetTreeJsonById`).then(getResult as any);
// }
// export function getEstateTreeData(organizeId, type?): Promise<any[]> {
//   const typestr = type !== undefined ? `&type=${type}` : '';
//   return request
//     .get(process.env.basePath + `/Common/GetTreeJson?organizeId=${organizeId}${typestr}`)
//     .then(getResult as any);
// }
