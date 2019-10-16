import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata, objToUrl } from '@/utils/networkUtils';
import request from '@/utils/request';

export function GetStatisticsTotal(data): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, { data: objToFormdata(data) });
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

// export function GetProjectType(): Promise<TreeEntity[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=ProjectType`)
//     .then(getResult as any);
// }

// 获取房产信息
export function GetFormInfoJson(keyValue): Promise<GmPstructure> {
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

// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/RemoveForm`, { data: objToFormdata({ keyValue }) })
    .then(getResult as any);
}

//获取房产列表
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//获取房态图楼层数据
export function GetFloorData(keyValue): Promise<any> {
  const data = {
    keyValue,
    type: 4,
  };
  return request
    .get(process.env.basePath + `/PStructs/GetPStructs?${objToUrl(data)}`)
    .then(getResult as any);
}

//获取房态图房间数据
export function GetRoomData(keyValue): Promise<any> {
  const data = {
    keyValue,
    type: 5,
  };
  return request
    .get(process.env.basePath + `/PStructs/GetPStructs?${objToUrl(data)}`)
    .then(getResult as any);
}

// //获取小区房间
// export function GetBuildings(pstructid): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetBuildings?parentId=${pstructid}`)
//     .then(getResult as any);
// }

//查询客户数据
export function GetCustomerList(keyword,organizeId): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetCustomerList?keyword=${keyword}&organizeId=${organizeId}`)
    .then(getResult as any);
}

// 验证code
export function ExistEnCode(keyValue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructs/ExistCode?keyValue=${keyValue}&code=${code}`)
    .then(getResult as any);
}