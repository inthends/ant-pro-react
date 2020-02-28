import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";

export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/WechatMenu/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/WechatMenu/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

export function GetPageItemListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/WechatMenu/GetPageItemListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存规则
export function SaveItemForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/WechatMenu/SaveItemForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

// 删除
export function RemoveItemForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/WechatMenu/RemoveItemForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}


// 查询用户
// export function searchUser(keyword): Promise<any[]> {
//   const type = "员工";
//   return request
//     .get(
//       process.env.basePath +
//         `/Common/GetUserList?${objToUrl({ keyword, type })}`
//     )
//     .then(getResult as any);
// }

// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/WechatMenu/RemoveForm?keyValue=${keyValue}`, {})
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
