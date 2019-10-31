
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

//列表
export function GetBillDetailsPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Dashboard/GetBillDetailsPageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//导出账单明细
export function ExportBillDetails(data): Promise<any> {
  return request.post(process.env.basePath + `/Dashboard/ExportBillDetails`, { data: objToFormdata(data) }).then(getResult as any);
}