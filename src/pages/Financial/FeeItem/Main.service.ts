import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { FeeItemData } from '@/model/feeItemData';

export function GetFeeTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetFeeTreeList`, {}).then(getResult as any);
} 
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/GetPageListJson`, {data:objToFormdata(data)}).then(getResult as any);
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
