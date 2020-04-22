import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwOffsetmain } from '@/model/cwOffsetmain';
import { GmCustomerinfo } from '@/model/gmCustomerinfo';

//获取付款费项
export function GetPaymentTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetPaymentFeeItemTreeJson`, {}).then(getResult as any);
}

//获取收款费项
export function GetReceivablesTree(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetReceivablesFeeItemTreeJson`, {}).then(getResult as any);
}

//查询冲抵列表
export function GetPageData(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/GetPageData`, { data: objToFormdata(data) }).then(getResult as any);
}

//查询冲抵明细列表
export function GetPageDetailData(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/GetPageDetailData`, { data: objToFormdata(data) }).then(getResult as any);
}

//根据主单id查询冲抵明细列表
export function GetListById(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/GetListById`, { data: objToFormdata(data) }).then(getResult as any);
}

//作废冲抵单
export function InvalidForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Lastschrift/InvalidForm?keyValue=${keyValue}`)
    .then(getResult as any);
}

//保存冲抵单
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/SaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//对账
export function CheckBill(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/CheckBill`, { data: objToFormdata(data) }).then(getResult as any);
}

// 获取实体
export function GetFormJson(data): Promise<CwOffsetmain> {
  return request.get(process.env.basePath + `/Lastschrift/GetFormJson?keyValue=${data}`).then(getResult as any);
}
//审核
export function Audit(data): Promise<any> {
  return request.post(process.env.basePath + `/Lastschrift/Audit`, { data: objToFormdata(data) }).then(getResult as any);
}
//获取客户详情
export function GetCustomInfo(data): Promise<GmCustomerinfo> {
  return request.get(process.env.basePath + `/PStructUser/GetFormJson?keyValue=${data}`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取当前用户信息
export function GetUserInfo(userid): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Setting/GetUserInfo?userid=${userid}`)
    .then(getResult as any);
}

export function Export(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Lastschrift/Export?billId=${keyValue}`, 
      // {
      //   responseType: "blob"
      // } 
    )
    .then(getResult as any);
}


