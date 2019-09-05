import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwReductionmain } from '@/model/cwReductionmain'; 

//加载收款费项
export function GetFeeTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {});
}

//加载房间树
export function GetTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/Common/GetQuickPStructsTree`, {});
}

// 查询明细列表
export function GetDetailPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Reduction/GetPageDetailListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

// 根据id查询明细列表
export function GetListByID(data): Promise<any> {
  return request.post(process.env.basePath + `/Reduction/GetListByID`, {data:objToFormdata(data)}).then(getResult as any);
}

// 查询列表
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Reduction/GetPageListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取实体
export function GetFormJson(keyValue): Promise<CwReductionmain> {
  return request
    .get(process.env.basePath + `/Reduction/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

//获取减免费项类型
export function GetReductionItem(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Reduction/SelectReduction`)
    .then(getResult as any);
}

//获取所有费项
export function GetAllFeeItems(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
    .then(getResult as any);
}

//获取当前用户信息
export function GetUseInfo(userid): Promise<any> {
  return request
    .get(process.env.basePath + `/Login/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}

//计算房屋减免后的应收费项数据
export function GetUnitBillDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/GetUnitBillDetail`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//审核减免单
export function AuditBill(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/Audit`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//删除减免单
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/RemoveForm?keyValue=${keyValue}`)
    .then(getResult as any);
}
//保存减免单
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/SaveForm`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//验证计费单是否可以取消审核
export function CheckBill(keyValue): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Reduction/CheckBill?keyValue=${keyValue}`)
    .then(getResult as any);
}

//删除减免单里面的全部房屋
export function RemoveFormUnitAll(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/RemoveFormUnitAll?keyValue=${keyValue}`)
    .then(getResult as any);
}