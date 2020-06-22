import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Worker/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Worker/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取部门树
export function GetDepartmentTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Worker/GetDepartmentTree`, {}).then(getResult as any);
}

export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Worker/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

// 查询部门
export function GetDepartmentTreeByOrgId(OrganizeId): Promise<any[]> {
  return request.get(process.env.basePath + `/Department/GetDepartmentTree?OrganizeId=${OrganizeId}`)
    .then(getResult as any);
}

// 验证code
export function ExistCode(keyvalue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/Worker/ExistCode?keyvalue=${keyvalue}&code=${code}`)
    .then(getResult as any);
}
