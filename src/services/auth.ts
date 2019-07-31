import { getResult } from '@/utils/networkUtils';
import request from '@/utils/request';
import { TableResBeanApiApplication, ApiApplication, ApiEnum } from '@/model/models';

export async function query(): any[] {
  return request
    .get(process.env.basePath + '/Authorize/GetModuleList')
    .then(getResult);
}
