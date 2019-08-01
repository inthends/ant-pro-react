import request from '@/utils/request';
import { BaseRespBean } from '@/model/models';

export function queryEnv(): Promise<Array<any>> {
  return request
    .post(process.env.basePath + '/api/env/queryAllEnv', {})
    .then(res => res.envList || []);
}
export function getCurrEnv(): Promise<string> {
  return request.post(process.env.basePath + '/api/env/get', {}).then(res => res.env);
}
export function setEnv(env): Promise<BaseRespBean> {
  return request.post(process.env.basePath + '/api/env/config', { data: { env } });
}
