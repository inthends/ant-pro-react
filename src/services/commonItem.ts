import { getResult } from '@/utils/networkUtils';
import { ResponseObject,TreeEntity } from '@/model/models';
import request from '@/utils/request';

//获取通用代码
export function getCommonItems(code: string): Promise<Array<TreeEntity>> {
    return request
      .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=${code}`)
      .then(getResult as any);
  }

  //查询客户数据
export function GetUserList(keyword,type): Promise<any> {
  return request
    .get(process.env.basePath + `/Common/GetUserList?keyword=${keyword}&type=${type}`)
    .then(getResult as any);
}

//下拉房屋树
export function GetQuickSimpleTreeAll(): Promise<ResponseObject<any>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {});
} 

//合同页面调用
export function GetQuickSimpleTreeAllForContract(): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForContract`, {});
} 

//公共区域页面调用
export function GetQuickSimpleTreeAllForArea(): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAllForArea`, {});
} 

// //获取小区以及楼栋
// export function GetBuildings(pstructid): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetBuildings?parentId=${pstructid}`)
//     .then(getResult as any);
// }

//获取下级
export function GetAsynChildBuildings(pstructid,type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildings?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

//获取公共区域下级
export function GetAsynChildBuildingsForArea(pstructid,type): Promise<any[]> { 
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForArea?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

// export function GetOrgTree(): Promise<any[]> {
//     return request
//       .get(process.env.basePath + `/Common/GetOrgTree`)
//       .then(getResult as any);
// }

export function GetOrgTree(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Common/GetOrgTree`)
    .then(getResult as any);
}

//只加载到管理处，项目管理模块左侧树使用
export function GetOrgTreeOnly(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`, {}).then(getResult);
}

//获取组织父子节点id
export function GetAllOrgIds(pstructid): Promise<string[]> {
  return request.get(process.env.basePath + `/Common/GetAllOrgIds?pstructid=${pstructid}`, {}).then(getResult);
}

//加载全部checkbox房间树
export function GetUnitTreeAll(): Promise<ResponseObject<any>> {
  return request.get(process.env.basePath + `/Common/GetUnitTreeAll`, {});
} 