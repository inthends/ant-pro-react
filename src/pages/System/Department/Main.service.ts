import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata, objToUrl } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetTreeJsonById(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Common/GetTreeJsonById`, {}).then(getResult);
}

//获取组织机构
export function GetTreeListJson(data): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/GetTreeListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Department/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Department/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 查询用户
export function searchUser(keyword): Promise<any[]> {
  const type = '员工';
  return request
    .get(process.env.basePath + `/Common/GetUserList?${objToUrl({ keyword, type })}`)
    .then(getResult as any);
}

// 验证code
export function ExistEnCode(keyValue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/ExistEnCode?keyValue=${keyValue}&code=${code}`)
    .then(getResult as any);
}

// 验证name
export function ExistName(keyValue, name): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/ExistFullName?keyValue=${keyValue}&name=${name}`)
    .then(getResult as any);
}

// 查询部门
export function GetDepartmentTree(OrganizeId): Promise<any[]> {
  return request.get(process.env.basePath + `/Department/GetDepartmentTree?OrganizeId=${OrganizeId}`)
    .then(getResult as any);
}

// 验证是否能删除
export function CheckDepartment(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/CheckDepartment?keyValue=${keyValue}`)
    .then(getResult as any);
}