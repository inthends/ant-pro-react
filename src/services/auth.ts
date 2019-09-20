import { getResult } from '@/utils/networkUtils';
import request from '@/utils/request';

//查询模块
export async function query(): Promise<any[]> {
  return request
    .get(process.env.basePath + '/Authorize/GetModuleList')
    .then(getResult);
}
//查询按钮
export async function queryBtn(): Promise<any[]> {
  return request
    .get(process.env.basePath + '/Authorize/GetModuleButtonList')
    .then(getResult);
}
