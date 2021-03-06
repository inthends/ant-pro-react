
import { getResult, objToFormdata, objToUrl } from '@/utils/networkUtils';
import request from '@/utils/request';


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
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Department/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/GetFormJson?keyvalue=${keyvalue}`)
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
export function ExistEnCode(keyvalue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/ExistEnCode?keyvalue=${keyvalue}&code=${code}`)
    .then(getResult as any);
}

// 验证name
export function ExistName(keyvalue, name): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/ExistFullName?keyvalue=${keyvalue}&name=${name}`)
    .then(getResult as any);
}

// 查询部门
export function GetDepartmentTree(OrganizeId): Promise<any[]> {
  return request.get(process.env.basePath + `/Department/GetDepartmentTree?OrganizeId=${OrganizeId}`)
    .then(getResult as any);
}

// 验证是否能删除
export function CheckDepartment(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Department/CheckDepartment?keyvalue=${keyvalue}`)
    .then(getResult as any);
}