import { getResult, objToFormdata, objToUrl } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Role/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
// 查询用户
export function searchUser(keyword): Promise<any[]> {
  const type = "员工";
  return request
    .get(
      process.env.basePath +
        `/Common/GetUserList?${objToUrl({ keyword, type })}`
    )
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Role/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
 
export function getUserList(data): Promise<any> {
  return request
    .get(
      process.env.basePath + `/PermissionRole/GetUserListJson?${objToUrl(data)}`
    )
    .then(getResult as any);
}

//获取模板分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Template/GetDataItemTreeList`, {}).then(getResult as any);
}

export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Template/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

