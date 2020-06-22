import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwOffsetmain } from '@/model/cwOffsetmain';
// import { CalOffsetMain } from '@/model/calOffsetMain';
import {GmCustomerinfo} from '@/model/gmCustomerinfo';

//获取付款费项
export function GetPaymentTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetPaymentFeeItemTreeJson`, {}).then(getResult as any);
}
//获取收款费项
export function GetReceivablesTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}

//查询冲抵列表
export function GetOffsetPageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/GetOffsetPageData`, {data:objToFormdata(data)}).then(getResult as any);
}

//查询冲抵明细列表
export function GetOffsetPageDetailData(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/GetOffsetPageDetailData`, {data:objToFormdata(data)}).then(getResult as any);
}

//根据主单id查询冲抵明细列表
export function GetListByID(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/GetListById`, {data:objToFormdata(data)}).then(getResult as any);
}

//作废冲抵单
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Offset/InvalidForm?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//保存冲抵单
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/SaveForm`, {data:objToFormdata(data)}).then(getResult as any);
}
// 获取实体
export function GetFormJson(data): Promise<CwOffsetmain> {
  return request.get(process.env.basePath + `/Offset/GetFormJson?keyvalue=${data}`).then(getResult as any);
}
//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/Audit`, {data:objToFormdata(data)}).then(getResult as any);
}
//获取客户详情
export function GetCustomInfo(data): Promise<GmCustomerinfo>  {
  return request.get(process.env.basePath + `/PStructUser/GetFormJson?keyvalue=${data}`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取当前用户信息
export function GetUserInfo(userid): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}
