// import { ResponseObject } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
 
//获取仓库列表
export function GetPageListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Warehouse/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 保存
export function SaveForm(data): Promise<any> { 
  return request
    .post(process.env.basePath + `/Warehouse/SaveForm`, { data:objToFormdata(data) })
    .then(getResult as any);
}

// 删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Warehouse/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}


