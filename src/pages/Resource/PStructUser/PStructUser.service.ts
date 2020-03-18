import { GmPstructure, ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructUser/GetListJson`, { data: objToFormdata(data) })
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
export function GetFormInfoJson(keyValue): Promise<GmPstructure> {
  return request
    .get(process.env.basePath + `/PStructs/GetFormInfoJson?keyValue=${keyValue}`)
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
    .post(process.env.basePath + `/PStructUser/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetCustomerInfo(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetCustomerInfo?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 验证是否能删除
export function CheckRelation(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/CheckRelation?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 验证
export function CheckCustomer(organizeId, name): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/CheckCustomer?organizeId=${organizeId}&name=${name}`)
    .then(getResult as any);
}

//查询客户数据
export function GetCustomerList(keyword,organizeId): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetCustomerList?keyword=${keyword}&organizeId=${organizeId}`)
    .then(getResult as any);
}

//合同承租方验证
export function CheckContractCustomer(name): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/CheckContractCustomer?name=${name}`)
    .then(getResult as any);
}

//查询客户数据
export function GetContractCustomerList(keyword): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetContractCustomerList?keyword=${keyword}`)
    .then(getResult as any);
}