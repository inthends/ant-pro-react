import { JcAccount } from '@/model/jcAccount';
import { getResult, objToFormdata, objToUrl } from '@/utils/networkUtils';
import request from '@/utils/request';

export function getDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Account/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<JcAccount> {
  return request
    .post(process.env.basePath + `/Account/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 查询用户
// export function searchUser(keyword): Promise<any[]> {
//   const type = '员工';
//   return request
//     .get(process.env.basePath + `/Common/GetUserList?${objToUrl({ keyword, type })}`)
//     .then(getResult as any);
// }


export function SearchUser(organizeId, keyword): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetSystemUserList?${objToUrl({ organizeId, keyword })}`)
    .then(getResult as any);
}

// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Account/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}


//重置密码
export function ResetPwd(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Account/ResetPwd?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 禁用切换
export function DisabledToggle(keyValue, disabled: boolean): Promise<any> {
  if (disabled) {
    return request
      .post(process.env.basePath + `/Account/DisabledAccount?keyValue=${keyValue}`, {})
      .then(getResult as any);
  } else {
    return request
      .post(process.env.basePath + `/Account/EnabledAccount?keyValue=${keyValue}`, {})
      .then(getResult as any);
  }
}

//权限操作

// 系统功能列表
export function GetAuths(userId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionUser/GetModuleTree?userId=${userId}`)
    .then(getResult as any);
}

// 数据权限列表
export function GetDataAuths(userId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionUser/GetPstructTree?userId=${userId}`)
    .then(getResult as any);
}

//获取选中的模块节点
export function GetCheckIds(userId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionUser/GetCheckIds?userId=${userId}`)
    .then(getResult as any);
}


//获取半选中的模块节点
export function GetHalfCheckIds(userId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionUser/GetHalfCheckIds?userId=${userId}`)
    .then(getResult as any);
}

//获取选中的数据节点
export function GetDataCheckIds(userId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionUser/GetDataCheckIds?userId=${userId}`)
    .then(getResult as any);
}

//获取半选中的模块数据节点
export function GetDataHalfCheckIds(userId): Promise<any> {
  return request
    .get(process.env.basePath + `/PermissionUser/GetDataHalfCheckIds?userId=${userId}`)
    .then(getResult as any);
}

export function SaveModuleAuthorize(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PermissionUser/SaveModuleAuthorize`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}
export function SaveDataAuthorize(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PermissionUser/SaveDataAuthorize`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}