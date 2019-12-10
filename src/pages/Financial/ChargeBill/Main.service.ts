import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwFeeitem } from '@/model/cwFeeitem';

// export function GetTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
//   return request.get(process.env.basePath + `/FeeItems/GetTreeListExpand`, {});
// }

//获取所有收费列表
export function GetReceivablesFeeItemTreeJson(roomId): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson?roomId=` + roomId, {}).then(getResult as any);;
}

//获取房间住户
export function GetRoomUsers(data): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetRoomUsers?roomid=${data}`, {}).then(getResult as any);;
}

//获取关联的房间
// export function GetUserRooms(data): Promise<ResponseObject<any[]>> {
//   return request.get(process.env.basePath + `/Common/GetUserRooms?customerid=${data}`, {}).then(getResult as any);;
// }

export function GetUserRoomsByRelationId(data): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetUserRoomsByRelationId?relationId=${data}`, {}).then(getResult as any);;
}

export function GetUserRooms(data): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetUserRooms?customerid=${data}`, {}).then(getResult as any);;
}

export function GetFeeItemDetail(feeitemid, roomid): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetFeeItemDetail?feeitemid=${feeitemid}&roomid=${roomid}`, {}).then(getResult as any);;
}

//未收
export function NotChargeFeeData(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/NotChargeFeeData`, { data: objToFormdata(data) }).then(getResult as any);
}

// 获取费项信息
export function GetFormJson(keyValue): Promise<CwFeeitem> {
  return request
    .get(process.env.basePath + `/FeeItems/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

//获取费项类型
export function GetFeeType(code): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=` + code)
    .then(getResult as any);
}

//获取所有费项
export function GetAllFeeItems(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
    .then(getResult as any);
}

//编辑和查看调用
export function GetShowDetail(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/BillingMain/GetShowDetail?keyvalue=${keyValue}`)
    .then(getResult as any);
}
//获取转费时候历史的房间住户
export function GetTransferRoomUsers(roomid, relationid): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Receivable/GetTransferRoomUsers?roomId=${roomid}&relationId=${relationid}`)
    .then(getResult as any);
}
//表单明细
export function GetEntity(keyValue): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Receivable/GetEntity?keyValue=${keyValue}`)
    .then(getResult as any);
}
// 收款
export function Charge(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/Charge`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//已收
export function ChargeFeePageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ChargeFeePageData`, { data: objToFormdata(data) }).then(getResult as any);
}

//对账单
export function ChargeCheckPageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ChargeCheckPageData`, { data: objToFormdata(data) }).then(getResult as any);
}

//修改计费明细
export function SaveDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveDetail`, { data: objToFormdata(data) }).then(getResult as any);
}

//保存临时加费计费单
export function SaveTempBill(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveTempBill`, { data: objToFormdata(data) }).then(getResult as any);
}

//拆费
export function SplitBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SplitBilling`, { data: objToFormdata(data) }).then(getResult as any);
}

//转费
export function TransferBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/TransferBilling`, { data: objToFormdata(data) }).then(getResult as any);
}

//作废计费单
export function InvalidBillForm(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/InvalidForm?keyValue=${keyValue}`).then(getResult as any);
}

//作废计费明细
export function InvalidBillDetailForm(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/InvalidBillDetailForm?keyValue=${keyValue}`).then(getResult as any);
}

//作废收款单
export function InvalidForm(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/InvalidForm?keyValue=${keyValue}`).then(getResult as any);
}

//冲红收款单/
export function RedFlush(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/RedFlush?keyValue=${keyValue}`).then(getResult as any);
}

//退款，参数收款单主id，支付记录主id
// export function RefundForm(rid, billId): Promise<any> {
//   return request.post(process.env.basePath + `/Receivable/RefundForm?rid=${rid}&billId=${billId}`).then(getResult as any);
// }

//确认收款
export function ConfirmForm(rid, billId): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ConfirmForm?rid=${rid}&billId=${billId}`).then(getResult as any);
}


//验证收款单是否可以冲红
export function CheckRedFlush(keyValue): Promise<any> {
  return request.get(process.env.basePath + `/Receivable/CheckRedFlush?keyValue=${keyValue}`).then(getResult as any);
}

//审核接口
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/Audit`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取收款单实体
export function GetEntityShow(keyValue): Promise<any> {
  return request.get(process.env.basePath + `/Receivable/GetEntityShow?keyValue=${keyValue}`).then(getResult as any);
}

//获取费用详情
export function ChargeFeeDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ChargeFeeDetail`, { data: objToFormdata(data) }).then(getResult as any);
}

//打印
export function Print(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/Print?keyValue=${keyValue}`).then(getResult as any);
}

// 如果改笔费用存在优惠，则需要选中与此费项有关的全部费用，一起缴款，否则给出提示 
export function CheckRebateFee(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/CheckRebateFee`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//送审的时候获取收款单列表
export function GetReceiveList(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/GetReceiveList`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取送审单总金额
export function GetTotalAmount(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/GetTotalAmount`, {data:objToFormdata(data)}).then(getResult as any);
}
 