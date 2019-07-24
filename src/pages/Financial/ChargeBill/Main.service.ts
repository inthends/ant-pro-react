import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { FeeItemData } from '@/model/feeItemData';
export function GetTreeListExpand(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/FeeItems/GetTreeListExpand`, {});
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

