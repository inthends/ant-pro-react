import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Template/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Template/RemoveForm?keyvalue=${keyvalue}`, {})
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

//获取打印模板
export function GetTemplates(unitId): Promise<any> {
  return request.get(process.env.basePath + `/Template/GetTemplates?unitId=${unitId}`).then(getResult as any);
}


//打印
export function Print(keyvalue, templateId): Promise<any> {
  return request.post(process.env.basePath + `/Template/Print?keyvalue=${keyvalue}&templateId=${templateId}`).then(getResult as any);
}

