 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';

//费表列表
export function GetBillDetailsPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetMeterPageList`, {data:objToFormdata(data)}).then(getResult as any);
}