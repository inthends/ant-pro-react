import { PStructsData, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetTreeJsonById(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Common/GetTreeJsonById`, {}).then(getResult);
}

//获取组织机构
export function GetTreeListJson(data): Promise<any> {
  return request
    .get(process.env.basePath + `/Organize/GetTreeListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}
 
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructUser/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructUser/RemoveForm`, { data: objToFormdata({ keyValue }) })
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}
