import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetQuickPublicAreaTree(): Promise<any[]> {
  return request
    .get(process.env.basePath + `/PublicArea/GetQuickPublicAreaTree`, {})
    .then(getResult);
}
export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetPublicAreas(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PublicArea/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

export function GetTreeAreaJson(id): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/PStructs/GetTreeAreaJson?id=${id}`)
    .then(getResult as any);
}
export function GetProjectType(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/PStructs/GetDataItemTreeJson?code=ProjectType`)
    .then(getResult as any);
}


//生成二维码
export function CreateQrCodeFrom(): Promise<any> {
  return request.post(process.env.basePath + `/PStructs/CreateQrCodeFrom`).then(getResult as any);
}

// 获取房产信息
export function GetFormInfoJson(keyvalue): Promise<GmPstructure> {
  return request
    .get(process.env.basePath + `/PStructs/GetFormInfoJson?keyvalue=${keyvalue}`)
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PublicArea/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 新增修改
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/PublicArea/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}
