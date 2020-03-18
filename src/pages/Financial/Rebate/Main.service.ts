import {  TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
// import { CwReductionmain } from '@/model/cwReductionmain'; 

//加载收款费项
// export function GetFeeTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
//   return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {});
// }

//获取收款费项
export function GetReceivablesTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}


// 查询明细列表
export function GetDetailPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Rebate/GetPageDetailListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

// 根据id查询明细列表
export function GetListById(data): Promise<any> {
  return request.post(process.env.basePath + `/Rebate/GetListById`, {data:objToFormdata(data)}).then(getResult as any);
}

// 查询列表
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Rebate/GetPageListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取实体
export function GetFormJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Rebate/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

//获取减免费项类型
export function GetReductionItem(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/Rebate/SelectReduction`)
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
    .get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}

//获取需要优惠的费用
export function GetUnitBillDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Rebate/GetUnitBillDetail`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//审核减免单
export function Audit(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Rebate/Audit`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//作废减免单
export function InvalidForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Rebate/InvalidForm?keyValue=${keyValue}`)
    .then(getResult as any);
}

//保存减免单和明细
export function SaveUnitForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Rebate/SaveUnitForm`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//保存减免单
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Rebate/SaveForm`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//验证计费单是否可以取消审核
export function CheckBill(keyValue): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Rebate/CheckBill?keyValue=${keyValue}`)
    .then(getResult as any);
}

//删除优惠单里面的全部房屋
export function RemoveFormAll(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Rebate/RemoveFormAll?keyValue=${keyValue}`)
    .then(getResult as any);
}

//判断收款单是否已经审核
export function CheckCharge(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/Rebate/CheckCharge?keyValue=${keyValue}`)
    .then(getResult as any);
}