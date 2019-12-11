import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowTask/GetPageListJson`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}