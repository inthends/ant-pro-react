import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

export function GetTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetTreeListExpand`, {});
}

export function GetReceivablesFeeItemTreeJson(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);;
}

//费表列表
export function GetMeterPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetMeterPageList`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取装表列表
export function GetUnitMeterPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetUnitMeterPageList`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取抄表单
export function GetReadingMeterPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetReadingMeterPageList`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取抄表单明细
export function GetMeterFormsPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetMeterFormsPageList`, {data:objToFormdata(data)}).then(getResult as any);
}

//删除费表
export function RemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveForm`, {data:objToFormdata(data)}).then(getResult as any);
}

//保存费表
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveForm`, {data:objToFormdata(data)}).then(getResult as any);
}
