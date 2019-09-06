import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { FeeItemData } from '@/model/feeItemData';

// export function GetTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
//   return request.get(process.env.basePath + `/FeeItems/GetTreeListExpand`, {});
// }

//获取所有收费列表
export function GetReceivablesFeeItemTreeJson(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);;
}

//获取房间住户
export function GetRoomUsers(data): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetRoomUsers?roomid=${data}`, {}).then(getResult as any);;
}

//获取关联的房间
export function GetUserRooms(data): Promise<ResponseObject<any[]>> {
  return request.get(process.env.basePath + `/Common/GetUserRooms?customerid=${data}`, {}).then(getResult as any);;
}
//
export function GetFeeItemDetail(feeitemid,roomid): Promise<ResponseObject<any>> {
  return request.get(process.env.basePath + `/Common/GetFeeItemDetail?feeitemid=${feeitemid}&roomid=${roomid}`, {}).then(getResult as any);;
}
//未收
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/NotChargeFeeData`, {data:objToFormdata(data)}).then(getResult as any);
}

// 获取费项信息
export function GetFormJson(keyValue): Promise<FeeItemData> {
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
export function GetShowDetail(data): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/BillingMain/GetShowDetail?keyvalue=${data}`)
    .then(getResult as any);
}
//获取转费时候历史的房间住户
export function GetTransferRoomUsers(roomid,relationid): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Receivable/GetTransferRoomUsers?roomId=${roomid}&relationId=${relationid}`)
    .then(getResult as any);
}
//表单明细
export function GetEntity(data): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Receivable/GetEntity?keyValue=${data}`)
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
  return request.post(process.env.basePath + `/Receivable/ChargeFeePageData`, {data:objToFormdata(data)}).then(getResult as any);
}

//修改计费明细
export function SaveDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveDetail`, {data:objToFormdata(data)}).then(getResult as any);
}

//保存临时加费计费单
export function SaveBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveBilling`, {data:objToFormdata(data)}).then(getResult as any);
}

//拆费
export function SplitBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SplitBilling`, {data:objToFormdata(data)}).then(getResult as any);
}

//转费
export function TransferBilling(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/TransferBilling`, {data:objToFormdata(data)}).then(getResult as any);
}

//删除计费单
export function RemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/RemoveForm?keyValue=${data}`).then(getResult as any);
}

//作废收款单/
export function InvalidForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/InvalidForm?keyValue=${data}`).then(getResult as any);
}

//冲红收款单/

export function RedFlush(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/RedFlush?keyValue=${data}`).then(getResult as any);
}

//验证收款单是否可以冲红
export function CheckRedFlush(data): Promise<any> {
  return request.get(process.env.basePath + `/Receivable/CheckRedFlush?keyValue=${data}`).then(getResult as any);
}
//审核接口
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/Audit`, {data:objToFormdata(data)}).then(getResult as any);
}


//获取收款单实体
export function GetEntityShow(data): Promise<any> {
  return request.get(process.env.basePath + `/Receivable/GetEntityShow?keyValue=${data}`).then(getResult as any);
}
//获取费用详情
export function ChargeFeeDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Receivable/ChargeFeeDetail`, {data:objToFormdata(data)}).then(getResult as any);
}
