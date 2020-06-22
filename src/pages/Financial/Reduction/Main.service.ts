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
  return request.post(process.env.basePath + `/Reduction/GetPageDetailListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

// 根据id查询减免单明细列表
export function GetListById(data): Promise<any> {
  return request.post(process.env.basePath + `/Reduction/GetListById`, {data:objToFormdata(data)}).then(getResult as any);
}

// 查询列表
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/Reduction/GetPageListJson`, {data:objToFormdata(data)}).then(getResult as any);
}

//获取实体
// export function GetFormJson(keyvalue): Promise<CwReductionmain> {
//   return request
//     .get(process.env.basePath + `/Reduction/GetFormJson?keyvalue=${keyvalue}`)
//     .then(getResult as any);
// }

export function GetFormJson(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Reduction/GetFormJson?keyvalue=${keyvalue}`)
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
    .get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}

//计算房屋减免后的应收费项数据
export function GetUnitBillDetail(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/GetUnitBillDetail`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//审核减免单
export function Audit(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/Audit`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//作废减免单
export function InvalidForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/InvalidForm?keyvalue=${keyvalue}`)
    .then(getResult as any);
}
//保存减免单
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/SaveForm`, {data:objToFormdata(data)})
    .then(getResult as any);
}

//验证是否可以取消审核
export function CheckBill(keyvalue): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Reduction/CheckBill?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//删除减免单里面的全部房屋
export function RemoveFormAll(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Reduction/RemoveFormAll?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//判断收款单是否已经审核
export function CheckCharge(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Reduction/CheckCharge?keyvalue=${keyvalue}`)
    .then(getResult as any);
}