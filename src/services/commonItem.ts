import { getResult } from '@/utils/networkUtils';
import { ResponseObject, TreeEntity } from '@/model/models';
import request from '@/utils/request';

//获取通用代码
export function GetCommonItems(code: string): Promise<Array<TreeEntity>> {
  return request
    .get(process.env.basePath + `/Common/GetDataItemTreeJson?code=${code}`)
    .then(getResult as any);
}

//查询客户数据
export function GetUserList(keyword, type): Promise<any> {
  return request
    .get(process.env.basePath + `/Common/GetUserList?keyword=${keyword}&type=${type}`)
    .then(getResult as any);
}

//下拉房屋树
// export function GetQuickSimpleTreeAll(): Promise<ResponseObject<any>> {
//   return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {});
// }

//服务单下拉房屋树，可以选择小区，楼栋，楼层和房间
export function GetQuickSimpleTreeAllForDeskService(): Promise<ResponseObject<any>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForDeskService`, {});
}

//合同页面调用
// export function GetQuickSimpleTreeAllForContract(): Promise<ResponseObject<any[]>> {
//   return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForContract`, {});
// }

//公共区域页面调用
// export function GetQuickSimpleTreeAllForArea(): Promise<ResponseObject<any[]>> {
//   return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForArea`, {});
// } 

export function GetQuickSimpleTreeAllForArea(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForArea`).then(getResult as any);
}

// //获取小区以及楼栋
// export function GetBuildings(pstructid): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetBuildings?parentId=${pstructid}`)
//     .then(getResult as any);
// }

//获取下级
export function GetAsynChildBuildings(pstructId, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildings?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

//获取下级
export function GetAsynChildBuildingsForHouse(pstructId, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForHouse?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

//获取公共区域下级
export function GetAsynChildBuildingsForArea(pstructId, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForArea?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

// export function GetOrgTree(): Promise<any[]> {
//     return request
//       .get(process.env.basePath + `/Common/GetOrgTree`)
//       .then(getResult as any);
// }

//获取合同管理房产下级，只加载到楼栋
export function GetAsynChildBuildingsForContract(pstructId,type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForContract?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

//只加载管理处,子级不可展开
export function GetOrgs(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetOrgs`).then(getResult as any);
}

//加载管理处，子级可展开加载楼盘
export function GetOrgTree(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetOrgTree`).then(getResult as any);
}

export function GetOrgTreeSimple(): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetOrgTreeSimple`)
    .then(getResult as any);
}

// 获取房间住户信息
export function GetRoomUser(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Common/GetRoomUser?keyValue=${keyValue}`)
    .then(getResult as any);
}

//获取下级
export function GetAsynChildBuildingsSimple(pstructId, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsSimple?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

//获取下级服务单使用
export function GetAsynChildBuildingsForServerDesk(pstructId, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForServerDesk?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

//异步获取下级房产，选择房间使用
export function GetAsynChildBuildingsForRoom(pstructId, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForRoom?parentId=${pstructId}&type=${type}`)
    .then(getResult as any);
}

// //只加载到管理处，项目管理模块左侧树使用
// export function GetOrgTreeOnly(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`, {}).then(getResult);
// }

//获取组织父子节点id
export function GetAllOrgIds(pstructId): Promise<string[]> {
  return request.get(process.env.basePath + `/Common/GetAllOrgIds?pstructId=${pstructId}`, {}).then(getResult);
}

//加载全部checkbox房间树
export function GetUnitTreeAll(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/Common/GetUnitTreeAll`, {});
}

// 查询机构不带管理处
export function GetOrgsWithNoGLC(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetOrgsWithNoGLC`).then(getResult as any);
}

// 查询机构管理处和小区
export function GetOrgEsates(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetOrgEsates`).then(getResult as any);
}


//获取审批记录
export function GetApproveLog(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/FlowTask/GetApproveLog?keyValue=${keyValue}`)
    .then(getResult as any);
}

export function GetQuickVirtualMeterTree(): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetQuickVirtualMeterTree?queryJson=${""}`, {}).then(getResult as any);;
}

export function GetQuickPublicMeterTree(): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetQuickPublicMeterTree?queryJson=${""}`, {}).then(getResult as any);;
}

//获取房间住户
export function GetRoomUsers(data): Promise< any[]> {
  return request.get(process.env.basePath + `/Common/GetRoomUsers?roomId=${data}`, {}).then(getResult as any);;
}
//获取关联的房间
export function GetUserRooms(data): Promise< any[]> {
  return request.get(process.env.basePath + `/Common/GetUserRooms?customerId=${data}`, {}).then(getResult as any);;
}

export function GetUserRoomsByRelationId(data): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetUserRoomsByRelationId?relationId=${data}`, {}).then(getResult as any);;
}

//付款费项
export function GetPayFeeItemDetail(feeitemId,roomId): Promise< any > {
  return request.get(process.env.basePath + `/Common/GetPayFeeItemDetail?feeitemId=${feeitemId}&roomId=${roomId}`, {}).then(getResult as any);;
}

//加载全部checkbox巡检点位
export function GetPointTreeAll(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/Common/GetPointTreeAll`, {});
} 

export function GetFeeItemDetail(feeItemId, roomId): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetFeeItemDetail?feeItemId=${feeItemId}&roomId=${roomId}`, {}).then(getResult as any);;
}

//获取费项类型
export function GetFeeType(code): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Common/GetDataItemTreeJson?code=` + code).then(getResult as any);
}

// export function GetTreeJsonById(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetTreeJsonById`, {}).then(getResult);
// }