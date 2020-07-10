import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";

export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Apartment/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Apartment/Audit`, {data:objToFormdata(data)});
}

// 新增修改
// export function SaveForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Member/SaveForm`, {
//       data: objToFormdata(data)
//     })
//     .then(getResult as any);
// }

// export function GetUnitPageListJson(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Member/GetUnitPageListJson`, {
//       data: objToFormdata(data)
//     })
//     .then(getResult as any);
// }

//保存规则
// export function SaveItemForm(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Member/SaveItemForm`, {
//       data: objToFormdata(data)
//     })
//     .then(getResult as any);
// }

//解绑
// export function RemoveUnitForm(keyvalue): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Member/RemoveUnitForm?keyvalue=${keyvalue}`, {})
//     .then(getResult as any);
// }

export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Apartment/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}


// 删除
// export function RemoveForm(keyvalue): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Member/RemoveForm?keyvalue=${keyvalue}`, {})
//     .then(getResult as any);
// }

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
