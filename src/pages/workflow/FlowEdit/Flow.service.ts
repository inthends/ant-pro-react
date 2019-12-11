import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowDesigner/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 逻辑删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowDesigner/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
 
// 查询机构
// export function searchOrgs(): Promise<any[]> {
//   return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`).then(getResult as any);
// }

//获取分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FlowDesigner/GetDataItemTreeList`, {}).then(getResult as any);
}

export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowDesigner/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
//获取角色
export function GetTreeRoleJson(): Promise<any[]> { 
  return request
    .get(process.env.basePath + `/FlowDesigner/GetTreeRoleJson`)
    .then(getResult as any);
}