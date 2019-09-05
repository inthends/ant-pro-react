import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

//通知单审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/Audit`, {data:objToFormdata(data)});
}

//获取通知单
export function GetEntityShow(data): Promise<any> {
  return request.get(process.env.basePath + `/Notice/GetEntityShow?keyValue=${data}`, {}).then(getResult as any);
}

//获取账单
export function GetBillPageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/GetBillPageData`, {data:objToFormdata(data)}).then(getResult as any);
}
//获取收费明细
export function ChargeFeeDetail(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/ChargeFeeDetail`, {data:objToFormdata(data)}).then(getResult as any);
}

//账单费用明细
export function ChargeFeePageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/ChargeFeePageData`, {data:objToFormdata(data)}).then(getResult as any);
}

//保存通知单
export function SaveBill(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/SaveBill`, {data:objToFormdata(data)}).then(getResult as any);
}

//通知单试算
export function TestCalBill(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/TestCalBill`, {data:objToFormdata(data)}).then(getResult as any);
}

//批量审核
export function BatchAudit(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/BatchAudit`, {data:objToFormdata(data)}).then(getResult as any);
}

//打印
export function Print(data): Promise<any> {
  return request.post(process.env.basePath + `/Notice/Print`, {data:objToFormdata(data)}).then(getResult as any);
}

//表单明细
export function GetBillCheck(data): Promise<any> {
  return request.get(process.env.basePath + `/Notice/GetBillCheck?keyValue=${data}`, {}).then(getResult as any);
}
//删除通知单
export function RemoveForm(data): Promise<any> {
  return request.get(process.env.basePath + `/Notice/RemoveForm?keyValue=${data}`, {}).then(getResult as any);
}
//
export function GetInfoFormJson(data): Promise<any> {
  return request.get(process.env.basePath + `/Notice/GetInfoFormJson?keyValue=${data}`, {}).then(getResult as any);
}
//验证是否生成通知单
export function CheckNoticeBill(data): Promise<any> {
  return request.get(process.env.basePath + `/Notice/CheckNoticeBill?keyValue=${data}`, {}).then(getResult as any);
}
//获取模板
export function GetTemplates(): Promise<any> {
  return request.get(process.env.basePath + `/Notice/GetTemplates`, {}).then(getResult as any);
}

//获取所有收费列表
export function GetReceivablesFeeItemTreeJson(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}
