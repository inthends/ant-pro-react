import { BaseRespBean } from '@/model/models';
import request from '@/utils/request';

export const register = (data): Promise<BaseRespBean> => {
  return request.post(process.env.basePath + '/login/signUp', {
    data,
  });
};
