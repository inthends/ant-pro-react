import request from '@/utils/request';
import { getResult, objToFormdata } from '@/utils/networkUtils';

export function getDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Account/GetPageListJson`, { data: objToFormdata(data) })
    .then(getResult as any);
}

// 删除
export function RemoveForm(keyValue): Promise<any> {
    return request
      .post(process.env.basePath + `/Account/RemoveForm?keyValue=${keyValue}`, {})
      .then(getResult as any);
  }
