import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { 	OffsetMainEntity } from '@/model/offsetMainEntity';
import { 	CalOffsetMain } from '@/model/calOffsetMain';

//加载所有收费项
export function GetCheckTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetTempPaymentFeeItemTreeJson`, {}).then(getResult as any);
}
//加载所有项
export function GetBillTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}
//加载房间数
export function GetRoomTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
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
export function SaveForm(unit,data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/SaveForm?units=${unit}`, {data:objToFormdata(data)}).then(getResult as any);
}
// 获取实体
export function GetFormJson(data): Promise<OffsetMainEntity> {
  return request.get(process.env.basePath + `/Offset/GetFormJson?keyValue=${data}`).then(getResult as any);
}
//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Offset/Audit`, {data:objToFormdata(data)}).then(getResult as any);
}
