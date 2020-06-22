import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwOffsetmain } from '@/model/cwOffsetmain';
import { GmCustomerinfo } from '@/model/gmCustomerinfo';

//获取付款费项
export function GetPaymentTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetPaymentFeeItemTreeJson`, {}).then(getResult as any);
}

//获取收款费项
export function GetReceivablesTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}

//查询列表
export function GetPageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/GetPageData`, { data: objToFormdata(data) }).then(getResult as any);
}

//查询明细列表
export function GetPageDetailData(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/GetPageDetailData`, { data: objToFormdata(data) }).then(getResult as any);
}

//根据主单id查询明细列表
export function GetListById(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/GetListById`, { data: objToFormdata(data) }).then(getResult as any);
}

//作废
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Lastschrift/InvalidForm?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//作废明细
export function InvalidItemForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Lastschrift/InvalidItemForm?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//保存
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/SaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//对账
export function CheckBill(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/CheckBill`, { data: objToFormdata(data) }).then(getResult as any);
}

// 获取实体
export function GetFormJson(data): Promise<CwOffsetmain> {
  return request.get(process.env.basePath + `/Lastschrift/GetFormJson?keyvalue=${data}`).then(getResult as any);
}
//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/Audit`, { data: objToFormdata(data) }).then(getResult as any);
}
//获取客户详情
export function GetCustomInfo(data): Promise<GmCustomerinfo> {
  return request.get(process.env.basePath + `/PStructUser/GetFormJson?keyvalue=${data}`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取当前用户信息
export function GetUserInfo(userid): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}

export function Export(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Lastschrift/Export?billId=${keyvalue}`, 
      // {
      //   responseType: "blob"
      // } 
    )
    .then(getResult as any);
}
