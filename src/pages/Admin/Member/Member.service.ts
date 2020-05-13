import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";

export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Member/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Member/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

export function GetUnitPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Member/GetUnitPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存规则
export function SaveItemForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Member/SaveItemForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

// 删除
export function RemoveItemForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Member/RemoveItemForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}


// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Member/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// export function getRoleTree(): Promise<any> {
//   return request
//     .get(process.env.basePath + `/PermissionRole/GetDepartmentTreeJson`)
//     .then(getResult as any);
// }

// export function getUserList(data): Promise<any> {
//   return request
//     .get(
//       process.env.basePath + `/PermissionRole/GetUserListJson?${objToUrl(data)}`
//     )
//     .then(getResult as any);
// }
