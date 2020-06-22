import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改
export function SaveContentForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/SaveContentForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 逻辑删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Maintenance/GetDataItemTreeList`, {}).then(getResult as any);
}

export function GetPageContentListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/GetPageContentListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 

//获取通用代码
export function GetCommonItemsNew(code: string): Promise<Array<TreeEntity>> {
  return request
    .get(process.env.basePath + `/Maintenance/GetDataItemTreeJson?code=${code}`)
    .then(getResult as any);
}