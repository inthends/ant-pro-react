import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

// export function GetTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
//   return request.get(process.env.basePath + `/FeeItems/GetTreeListExpand`, {});
// }

// //加载房间树
// export function GetHouseTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
//   return request.get(process.env.basePath + `/Common/GetQuickSimpleTreeAll`, {}).then(getResult as any);
// }

//费表列表
export function GetMeterPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetMeterPageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//生成二维码
export function CreateQrCodeFrom(): Promise<any> {
  return request.post(process.env.basePath + `/Meter/CreateQrCodeFrom`).then(getResult as any);
}

//获取装表列表
export function GetUnitMeterPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetUnitMeterPageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取抄表单
export function GetReadingMeterPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetReadingMeterPageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取抄表单明细
export function GetMeterFormsPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetMeterFormsPageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//删除费表
export function RemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveForm?keyvalue=${data}`, { data: objToFormdata(data) });
}

//保存费表
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//费表关联房间保存
export function UnitMeterSaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/UnitMeterSaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取编码类型
export function GetDataItemTreeJson(data): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=${data}`, {}).then(getResult as any);;
}
//加载管理处

export function GetOrgTree(): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetOrgTree`, {}).then(getResult as any);;
}
//获取所有收费列表
export function GetReceivablesFeeItemTreeJson(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);;
}

//获取费表装表明细
export function GetPageListWithMeterID(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetPageListWithMeterID`, { data: objToFormdata(data) }).then(getResult as any);;
}

//获取费表信息
export function GetInfoFormJson(data): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/Meter/GetInfoFormJson?keyValue=${data}`, {}).then(getResult as any);;
}

//获取房间费表信息
export function GetUnitMeterInfoFormJson(data): Promise<any> {
  return request.get(process.env.basePath + `/Meter/GetUnitMeterInfoFormJson?keyValue=${data}`, {}).then(getResult as any);;
}

//删除房屋表
export function RemoveUnitForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveUnitForm?keyValue=${data}`, {}).then(getResult as any);;
}

//删除房屋抄表明细
export function RemoveReadingUnitForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadingUnitForm?keyValue=${data}`, {}).then(getResult as any);;
}

//获取费项实体
export function GetFeeDetailJson(data): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetFormJson?keyValue=${data}`, {}).then(getResult as any);;
}

//批量删除房屋表
export function RemoveFormAll(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveFormAll?keyValue=${data}`, {}).then(getResult as any);;
}

//保存房屋费表信息
export function SaveUnitMeterForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveUnitMeterForm`, { data: objToFormdata(data) }).then(getResult as any);;
}

// 保存虚拟表
export function SaveVirtualForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveVirtualForm`, { data: objToFormdata(data) }).then(getResult as any);;
}
// 保存公用表数据
export function SavePublicForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SavePublicForm`, { data: objToFormdata(data) }).then(getResult as any);;
}
// 抄表单保存房屋费表
export function SaveUnitForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveUnitForm`, { data: objToFormdata(data) }).then(getResult as any);;
}
// 虚拟表明细列表
export function GetVirtualReadPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetVirtualReadPageList`, { data: objToFormdata(data) }).then(getResult as any);;
}

// 抄表单保存
export function SaveMainForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveMainForm`, { data: objToFormdata(data) }).then(getResult as any);;
}

//获取水电表
export function GetMeterTreeJson(data): Promise<any> {
  return request.get(process.env.basePath + `/Meter/GetMeterTreeJson?EnCode=${data}`, {}).then(getResult as any);;
}

//公用表抄表明细列表
export function GetPublicReadPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetPublicReadPageList`, { data: objToFormdata(data) }).then(getResult as any);;
}

//房屋费表抄表明细列表
export function GetUnitReadPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetUnitReadPageList`, { data: objToFormdata(data) }).then(getResult as any);;
}

//Common/GetQuickVirtualMeterTree
export function GetQuickVirtualMeterTree(): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetQuickVirtualMeterTree?queryJson=${""}`, {}).then(getResult as any);;
}

export function GetQuickPublicMeterTree(): Promise<any> {
  return request.get(process.env.basePath + `/Common/GetQuickPublicMeterTree?queryJson=${""}`, {}).then(getResult as any);;
}

//抄表单详细
export function GetMeterRead(data): Promise<any> {
  return request.get(process.env.basePath + `/Meter/GetMeterRead?keyValue=${data}`, {}).then(getResult as any);;
}

//全部删除单元抄表 
export function RemoveReadUnitFormAll(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadUnitFormAll?keyValue=${data}`, {}).then(getResult as any);;
}

//全部删除公用抄表
export function RemoveReadPublicFormAll(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadPublicFormAll?keyValue=${data}`, {}).then(getResult as any);;
}

//删除公用抄表
export function RemoveReadPublicForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadPublicForm?keyValue=${data}`, {}).then(getResult as any);;
}

//全部删除虚拟抄表
export function RemoveReadVirtualFormAll(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadVirtualFormAll?keyValue=${data}`, {}).then(getResult as any);;
}
//删除虚拟抄表
export function RemoveReadVirtualForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadVirtualForm?keyValue=${data}`, {}).then(getResult as any);;
}
//删除抄表单
export function RemoveReadForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/RemoveReadForm?keyValue=${data}`, {}).then(getResult as any);;
}

//审核抄表单
export function AuditReading(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/AuditReading`, { data: objToFormdata(data) }).then(getResult as any);;
}
//直接修改房屋费表
export function SaveReadUnitForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveReadUnitForm`, { data: objToFormdata(data) }).then(getResult as any);;
}
//直接修改公共费表
export function SaveReadPublicForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/SaveReadPublicForm`, { data: objToFormdata(data) }).then(getResult as any);;
}
