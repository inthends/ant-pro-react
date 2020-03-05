import { getResult } from '@/utils/networkUtils';
import { ResponseObject, TreeEntity } from '@/model/models';
import request from '@/utils/request';

//获取通用代码
export function getCommonItems(code: string): Promise<Array<TreeEntity>> {
  return request
    .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=${code}`)
    .then(getResult as any);
}

//查询客户数据
export function GetUserList(keyword, type): Promise<any> {
  return request
    .get(process.env.basePath + `/Common/GetUserList?keyword=${keyword}&type=${type}`)
    .then(getResult as any);
}

//下拉房屋树
export function GetQuickSimpleTreeAll(): Promise<ResponseObject<any>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {});
}

//服务单下拉房屋树，可以选择小区，楼栋，楼层和房间
export function GetQuickSimpleTreeAllForDeskService(): Promise<ResponseObject<any>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForDeskService`, {});
}

//合同页面调用
export function GetQuickSimpleTreeAllForContract(): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForContract`, {});
}

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
export function GetAsynChildBuildings(pstructid, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildings?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

//获取下级
export function GetAsynChildBuildingsForHouse(pstructid, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForHouse?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

//获取公共区域下级
export function GetAsynChildBuildingsForArea(pstructid, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForArea?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

// export function GetOrgTree(): Promise<any[]> {
//     return request
//       .get(process.env.basePath + `/Common/GetOrgTree`)
//       .then(getResult as any);
// }


//获取合同管理房产下级，只加载到楼栋
export function GetAsynChildBuildingsForContract(pstructid,type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForContract?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}


export function GetOrgTree(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Common/GetOrgTree`)
    .then(getResult as any);
}

export function GetOrgTreeSimple(): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetOrgTreeSimple`)
    .then(getResult as any);
}

//获取下级
export function GetAsynChildBuildingsSimple(pstructid, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsSimple?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

//获取下级服务单使用
export function GetAsynChildBuildingsForDesk(pstructid, type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForDesk?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

// //只加载到管理处，项目管理模块左侧树使用
// export function GetOrgTreeOnly(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`, {}).then(getResult);
// }

//获取组织父子节点id
export function GetAllOrgIds(pstructid): Promise<string[]> {
  return request.get(process.env.basePath + `/Common/GetAllOrgIds?pstructid=${pstructid}`, {}).then(getResult);
}

//加载全部checkbox房间树
export function GetUnitTreeAll(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/Common/GetUnitTreeAll`, {});
}

// 查询机构管理处
export function GetOrgs(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`).then(getResult as any);
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