import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
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

//获取房产数据到楼栋，因为系统权限控制到楼栋
export function GetOrgBuildingTree(): Promise<any[]> {
  return request.get(process.env.basePath + `/PStructs/GetOrgBuildingTree`, {}).then(getResult);
}

// 获取房产信息
export function GetFormInfoJson(keyvalue): Promise<GmPstructure> {
  return request
    .get(process.env.basePath + `/PStructs/GetFormInfoJson?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/RemoveForm`, { data: objToFormdata({ keyvalue }) })
    .then(getResult as any);
}

//获取房产列表
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructs/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// export function GetFloorData(keyvalue): Promise<any> {
//   const data = {
//     keyvalue
//   };
//   return request
//     .get(process.env.basePath + `/PStructs/GetFloorData?${objToUrl(data)}`)
//     .then(getResult as any);
// }

//获取房态图楼层和房间数据
export function GetFloorData(keyvalue): Promise<any> {
  // const data = {
  //   keyvalue
  // };
  return request
    .get(process.env.basePath + `/PStructs/GetFloorData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}


//获取房态图房间数据
// export function GetRoomData(keyvalue): Promise<any> {
//   const data = {
//     keyvalue,
//     type: 5,
//   };
//   return request
//     .get(process.env.basePath + `/PStructs/GetPStructs?${objToUrl(data)}`)
//     .then(getResult as any);
// }



//查询客户数据
export function GetCustomerList(keyword,organizeId): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetCustomerList?keyword=${keyword}&organizeId=${organizeId}`)
    .then(getResult as any);
}

// 验证code
export function ExistEnCode(keyvalue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructs/ExistCode?keyvalue=${keyvalue}&code=${code}`)
    .then(getResult as any);
}

//拆分房间
export function SplitUnit(data): Promise<any> {
  return request.post(process.env.basePath + `/PStructs/SplitUnit`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取全称
export function GetNewAllName(parentId, name): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructs/GetNewAllName?parentId=${parentId}&name=${name}`)
    .then(getResult as any);
}
