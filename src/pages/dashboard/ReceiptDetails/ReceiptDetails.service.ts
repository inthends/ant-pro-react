 
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


//列表
export function GetReceiptDetailsPageList(data): Promise<any> {
  return request.post(process.env.basePath + `/Meter/GetMeterPageList`, {data:objToFormdata(data)}).then(getResult as any);
}

 