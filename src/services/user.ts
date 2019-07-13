import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(id): Promise<any> {
  return request(process.env.basePath + `/Login/GetUserInfo?userid=${id}`);
}

export async function queryNotices(): Promise<any> {
  return request(process.env.basePath + '/api/notices');
}

export const queryUserListService = () => request.get('/sys/user/userList');

export const bindUserService = data =>
  request.post(process.env.basePath + '/sys/user/save', {
    data,
  });

export const queryUserRolesService = () => request.get('/sys/user/roles');
