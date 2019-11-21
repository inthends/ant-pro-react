
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

//列表
export function GetReceivabledividePageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Dashboard/GetReceivabledividePageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//导出
export function ExportReceivabledivide(data): Promise<any> {
  return request.post(process.env.basePath + `/Dashboard/ExportReceivabledivide`, { data: objToFormdata(data) }).then(getResult as any);
}