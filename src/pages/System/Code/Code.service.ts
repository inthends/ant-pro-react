import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";

export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Code/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Code/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

export function GetPageItemListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Code/GetPageItemListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存规则
export function SaveItemForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Code/SaveItemForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//删除
export function RemoveItemForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Code/RemoveItemForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}


//删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Code/RemoveForm?keyvalue=${keyvalue}`, {})
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
