import request from '@/utils/request';
import { TableResBeanApiApplication, ApiApplication, ApiEnum } from '@/model/models';

export async function query(): Promise<Array<ApiApplication>> {
  const data = {
    pageNum: 1,
    limit: 100,
  };
  return request
    .post(process.env.basePath + '/api/app/queryList', { data })
    .then((res: TableResBeanApiApplication) => res.data || []);
}

export function queryEnumByApp(appId: number): Promise<Array<ApiEnum>> {
  const data = {
    pageNum: 1,
    limit: 100,
    appId,
  };
  return request
    .post(process.env.basePath + '/api/enum/queryEnumList', { data })
    .then((res) => res.data || []);
}
