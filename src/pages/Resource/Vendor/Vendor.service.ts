import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Vendor/GetPageListJson`, { data: objToFormdata(data) })
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

// 获取房产信息
export function GetFormInfoJson(keyvalue): Promise<GmPstructure> {
  return request
    .get(process.env.basePath + `/PStructs/GetFormInfoJson?keyvalue=${keyvalue}`)
    .then(getResult as any);
}
// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Vendor/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 新增修改
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Vendor/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetDetailJson(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Vendor/GetFormJson?keyvalue=${keyvalue}`)
    .then(getResult as any);
}


//查询往来单位数据
export function GetVendorList(keyword): Promise<any> {
  return request
    .get(process.env.basePath + `/Vendor/GetVendorList?keyword=${keyword}`)
    .then(getResult as any);
}

//验证
export function CheckVendor(name): Promise<any> {
  return request
    .get(process.env.basePath + `/Vendor/CheckVendor?name=${name}`)
    .then(getResult as any);
}

