// import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata, objToUrl } from '@/utils/networkUtils';
import request from '@/utils/request';
// export function GetTreeJsonById(): Promise<TreeEntity[]> {
//   return request.get(process.env.basePath + `/Common/GetTreeJsonById`, {}).then(getResult);
// }

//获取组织机构
export function GetTreeListJson(data): Promise<any> {
  return request
    .get(process.env.basePath + `/Organize/GetTreeListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Organize/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Organize/RemoveForm`, { data: objToFormdata({ keyValue }) })
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Organize/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 查询用户
export function searchUser(keyword): Promise<any[]> {
  const type = '员工';
  return request
    .get(process.env.basePath + `/Common/GetUserList?${objToUrl({ keyword, type })}`)
    .then(getResult as any);
}
// 查询类型
export function searchTypes(): Promise<any[]> {
  const enCode = 'OrgLevel';
  return request
    .get(process.env.basePath + `/Common/GetDataItemTreeJson?${objToUrl({ enCode })}`)
    .then(getResult as any);
}

// 查询上级机构
export function searchOrgs(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetOrgTree2`).then(getResult as any);
}