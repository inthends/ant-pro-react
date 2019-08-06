import { getResult } from '@/utils/networkUtils';
import request from '@/utils/request';

export async function query(): Promise<any[]> {
  return request
    .get(process.env.basePath + '/Authorize/GetModuleList')
    .then(getResult);
}
export async function queryBtn(): Promise<any[]> {
  return request
    .get(process.env.basePath + '/Authorize/GetModuleButtonList')
    .then(getResult);
}
