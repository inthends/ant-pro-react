import { getResult, objToFormdata, objToUrl } from '@/utils/networkUtils';
import request from '@/utils/request';

export function getDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Role/GetPageListJson`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Role/SaveForm`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}
// 查询用户
export function searchUser(keyword): Promise<any[]> {
  const type = '员工';
  return request
    .get(process.env.basePath + `/Common/GetUserList?${objToUrl({ keyword, type })}`)
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Role/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
export function getRoleTree(): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetDepartmentTreeJson`)
    .then(getResult as any);
}
export function getUserList(data): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetUserListJson?${objToUrl(data)}`)
    .then(getResult as any);
}

// export function chooseUser(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/PermissionRole/SaveMember`, {
//       data: { ...data, userIds: data.userIds.join(',') },
//     })
//     .then(getResult as any);
// }

// 系统功能列表
export function GetAuths(roleId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetModuleTree?roleId=${roleId}`)
    .then(getResult as any);
}

// 系统按钮列表
// export function GetButtonAuths(roleId): Promise<any> {
//   return request
//     .get(process.env.basePath + `/PermissionRole/ModuleButtonTreeJson?roleId=${roleId}`)
//     .then(getResult as any);
// }

// 数据权限列表
export function GetDataAuths(roleId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetPstructTree?roleId=${roleId}`)
    .then(getResult as any);
}

//获取选中的模块节点
export function GetCheckIds(roleId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetCheckIds?roleId=${roleId}`)
    .then(getResult as any);
}


//获取半选中的模块节点
export function GetHalfCheckIds(roleId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetHalfCheckIds?roleId=${roleId}`)
    .then(getResult as any);
}

export function SaveModuleAuthorize(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PermissionRole/SaveModuleAuthorize`, {
      data:objToFormdata(data),
    })
    .then(getResult as any);
}
export function SaveDataAuthorize(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PermissionRole/SaveDataAuthorize`, {
      data:objToFormdata(data),
    })
    .then(getResult as any);
}

export function chooseUser(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PermissionRole/SaveMember`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}

//获取选中的数据节点
export function GetDataCheckIds(roleId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetDataCheckIds?roleId=${roleId}`)
    .then(getResult as any);
}


//获取半选中的模数据节点
export function GetDataHalfCheckIds(roleId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionRole/GetDataHalfCheckIds?roleId=${roleId}`)
    .then(getResult as any);
}