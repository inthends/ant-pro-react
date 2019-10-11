import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


//获取费用列表
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/GetPageListJson`, {data:objToFormdata(data)}).then(getResult as any);
}
//获取费用明细列表
export function GetPageDetailListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/GetPageDetailListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取所有收费列表
// export function GetReceivablesFeeItemTreeJson(): Promise<ResponseObject<TreeEntity[]>> {
//   return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
// }

export function GetReceivablesFeeItemTreeJson(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}

//表单明细
export function GetBilling(data): Promise<any> {
  return request.get(process.env.basePath + `/BillingMain/GetBilling?keyValue=${data}`, {}).then(getResult as any);
}
//删除费项明细
export function RemoveUnitForm(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/RemoveUnitForm?keyValue=${keyValue}`, {}).then(getResult as any);
}
//删除全部计费明细
export function RemoveUnitFormAll(keyValue): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/RemoveUnitFormAll?keyValue=${keyValue}`, {}).then(getResult as any);
}

//保存周期费数据
export function SaveUnitFee(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveUnitFee`, {data:objToFormdata(data)});
}

//权责摊销
export function SaveDivide(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/Divide`, {data:objToFormdata(data)});
}

//保存计费主单
export function SaveMain(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveMain`, {data:objToFormdata(data)});
}
//计费保存
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/SaveForm`, {data:objToFormdata(data)});
}
//保存计费主单
export function RemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/RemoveForm?keyValue=${data}`, {});
}

//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/BillingMain/Audit`, {data:objToFormdata(data)});
}
