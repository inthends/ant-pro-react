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
//加载房间数
export function GetRoomTreeListExpand(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {}).then(getResult as any);
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
export function GetOffsetPageDetailDataByID(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/GetOffsetPageDetailDataByID`, {data:objToFormdata(data)}).then(getResult as any);
}
//删除冲抵单
export function RemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/RemoveForm`, {data:objToFormdata(data)}).then(getResult as any);
}
//保存冲抵单
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/SaveForm`, {data:objToFormdata(data)}).then(getResult as any);
}
// 获取实体
export function GetFormJson(data): Promise<CwOffsetmain> {
  return request.get(process.env.basePath + `/Offset/GetFormJson?keyValue=${data}`).then(getResult as any);
}
//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/Audit`, {data:objToFormdata(data)}).then(getResult as any);
}
//获取客户详情
export function GetCustomInfo(data): Promise<GmCustomerinfo>  {
  return request.get(process.env.basePath + `/PStructUser/GetFormJson?keyValue=${data}`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取当前用户信息
export function GetUserInfo(userid): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Login/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}