import { ResponseObject, TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
export function GetTreeJsonById(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/PStructs/GetTreeJsonById`, {});
}
export function GetStatisticsTotal(): Promise<ResponseObject<any>> {
  return request.post(process.env.basePath + `/PStructs/GetStatisticsTotal`, {});
}
export function GetStatistics(data): Promise<any> {
  return request.post(process.env.basePath + `/PStructs/GetStatistics`, {data:objToFormdata(data)}).then(getResult as any);
}

