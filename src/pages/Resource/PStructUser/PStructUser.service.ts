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

//选择人员
export function GetPageListJsonForSelect(data): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructUser/GetPageListJsonForSelect`, { data: objToFormdata(data) })
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
    .post(process.env.basePath + `/PStructUser/SaveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}
// 作废
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/PStructUser/InvalidForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

// 查询详情
export function GetCustomerInfo(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetCustomerInfo?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

export function GetParkingCustomerInfo(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/GetParkingCustomerInfo?keyvalue=${keyvalue}`)
    .then(getResult as any);
}


// 验证是否能删除
export function CheckRelation(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/CheckRelation?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

// 验证code
export function ExistCode(keyvalue, code): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/ExistCode?keyvalue=${keyvalue}&code=${code}`)
    .then(getResult as any);
}

// 验证手机号码
export function ExistCellphone(keyvalue, cellphone): Promise<any> {
  return request
    .get(process.env.basePath + `/PStructUser/ExistCellphone?keyvalue=${keyvalue}&cellphone=${cellphone}`)
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