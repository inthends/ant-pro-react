import {  TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

//保存应付款
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/SaveForm?keyValue=${data.keyValue}`, {data:data.entity});
}

//审批
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/Audit?keyValue=${data.keyValue}`, {data:data.entity});
}

//应付列表
export function NotPaymentFeeData(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/NotPaymentFeeData`, {data:objToFormdata(data)}).then(getResult as any);
}
///付款明细
export function ChargeFeeDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/PaymentFeeDetail`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取收费明细
export function ChargeFeePageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/PaymentFeePageData`, {data:objToFormdata(data)}).then(getResult as any);
}
//获取付款费项
export function GetTempPaymentFeeItemTreeJson(code): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetPaymentFeeItemTreeJson?roomid=` + code)
    .then(getResult as any);
}

//编辑和查看调用
export function GetShowDetail(data): Promise<any> {
  return request.get(process.env.basePath + `/Payment/GetShowDetail?keyValue=${data}`, {}).then(getResult as any);
}

//作废付款单
export function InvalidForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/InvalidForm?keyValue=${data}`, {}).then(getResult as any);
}//

//审核页面获取付款单实体
export function GetEntity(data): Promise<any> {
  return request.get(process.env.basePath + `/Payment/GetEntity?keyValue=${data}`, {}).then(getResult as any);
}
////删除付款费用
export function RemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/RemoveForm?keyValue=${data}`, {}).then(getResult as any);
}
//付款
export function Pay(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/Pay`, {data:objToFormdata(data)}).then(getResult as any);
}
//获取房间住户
export function GetRoomUsers(data): Promise< any[]> {
  return request.get(process.env.basePath + `/Common/GetRoomUsers?roomid=${data}`, {}).then(getResult as any);;
}
//获取关联的房间
export function GetUserRooms(data): Promise< any[]> {
  return request.get(process.env.basePath + `/Common/GetUserRooms?customerid=${data}`, {}).then(getResult as any);;
}
//
export function GetFeeItemDetail(feeitemid,roomid): Promise< any > {
  return request.get(process.env.basePath + `/Common/GetFeeItemDetail?feeitemid=${feeitemid}&roomid=${roomid}`, {}).then(getResult as any);;
}

//付款明细
export function PaymentFeeDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Payment/PaymentFeeDetail`, {data:objToFormdata(data)}).then(getResult as any);
}
