import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwFeeitem } from '@/model/cwFeeitem';

//获取所有收费列表
export function GetReceivablesFeeItemTreeJson(roomId): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson?roomId=` + roomId, {}).then(getResult as any);;
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

export function GetShowDetailByMainId(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/BillingMain/GetShowDetailByMainId?keyvalue=${keyValue}`)
    .then(getResult as any);
}

//获取转费时候历史的房间租户
export function GetTransferRoomUsers(roomid, relationid): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Receivable/GetTransferRoomUsers?roomId=${roomid}&relationId=${relationid}`)
    .then(getResult as any);
}

//表单明细
export function GetEntity(keyValue): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Receivable/GetEntity?keyValue=${keyValue}`)
    .then(getResult as any);
}

//收款
export function Charge(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/Charge`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//计算
export function CalFee(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/CalFee`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// export function CalFee(sumAmount,mlType, mlScale): Promise<any> {
//   return request
//     .get(process.env.basePath + `/Receivable/CalFee?sumAmount=${sumAmount}&mlType=${mlType}&mlScale=${mlScale}`)
//     .then(getResult as any);
// }

//二维码收款
// export function QrCodeCharge(data): Promise<any> {
//   return request
//     .post(process.env.basePath + `/Receivable/QrCodeCharge`, { data: objToFormdata(data) })
//     .then(getResult as any);
// }

//轮询收款单状态，用于二维码支付
export function GetPayState(tradenoId): Promise<any> {
  return request
    .get(process.env.basePath + `/Receivable/GetPayState?tradenoId=${tradenoId}`)
    .then(getResult as any);
}

//生成二维码
export function GetQrCode(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/GetQrCode`, { data: objToFormdata(data) })
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

//减免
export function ReductionBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/ReductionBilling`, { data: objToFormdata(data) }).then(getResult as any);
}

//优惠
export function RebateBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/RebateBilling`, { data: objToFormdata(data) }).then(getResult as any);
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

//收款单对账
export function CheckBill(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/CheckBill`, { data: objToFormdata(data) }).then(getResult as any);
}

//送审
export function SubmitForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/SubmitForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取收款单实体
export function GetEntityShow(keyValue): Promise<any> {
  return request.get(process.env.basePath + `/Receivable/GetEntityShow?keyValue=${keyValue}`).then(getResult as any);
}

//获取费用详情列表
export function ChargeFeeDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ChargeFeeDetail`, { data: objToFormdata(data) }).then(getResult as any);
}

//打印
export function Print(keyValue, templateId): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/Print?keyValue=${keyValue}&templateId=${templateId}`).then(getResult as any);
}

// 如果改笔费用存在优惠，则需要选中与此费项有关的全部费用，一起缴款，否则给出提示 
export function CheckRebateFee(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/CheckRebateFee`, { data: objToFormdata(data) })
    .then(getResult as any);
}


 //判断之前账单日是否已经勾选，不允许跨账单缴费
export function CheckFeeBillDate(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Receivable/CheckFeeBillDate`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//送审的时候获取收款单列表
export function GetReceiveList(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/GetReceiveList`, { data: objToFormdata(data) }).then(getResult as any);
}

//删除送审单明细
export function RemoveSubmitDetail(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/RemoveSubmitDetail?keyValue=${keyValue}`).then(getResult as any);
}


//获取送审单总金额
export function GetTotalAmount(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/GetTotalAmount`, { data: objToFormdata(data) }).then(getResult as any);
}


//获取送审单实体
export function GetSubmitEntity(keyValue): Promise<any> {
  return request.get(process.env.basePath + `/Receivable/GetSubmitEntity?keyValue=${keyValue}`).then(getResult as any);
}

//查看的时候获取送审单明细
export function GetReceiveListByBillId(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/GetReceiveListByBillId`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取未送审批的已收
export function GetUnSubmitChargeList(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/GetUnSubmitChargeList`, { data: objToFormdata(data) }).then(getResult as any);
}

//退回后重新送审保存明细
export function SaveSubmitDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/SaveSubmitDetail`, { data: objToFormdata(data) }).then(getResult as any);
}

//收款单重新送审
export function ReSubmitForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ReSubmitForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取打印模板
export function GetTemplates(unitId): Promise<any> {
  return request.get(process.env.basePath + `/Template/GetTemplates?unitId=${unitId}`).then(getResult as any);
}

// 收款抹零
export function Call(data): Promise<any> {
  return request
    .post(process.env.basePath + `/BillingMain/Call`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//保存票据
export function SaveNote(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/SaveNote`, { data: objToFormdata(data) }).then(getResult as any);
}

//修改收款单
export function SavaReceiveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/SavaReceiveForm`, { data: objToFormdata(data) }).then(getResult as any);
}