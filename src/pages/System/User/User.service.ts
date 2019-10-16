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
export function searchUser(keyword): Promise<any[]> {
  const type = '员工';
  return request
    .get(process.env.basePath + `/Common/GetUserList?${objToUrl({ keyword, type })}`)
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Account/RemoveForm?keyValue=${keyValue}`, {})
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
 