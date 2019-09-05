//获取异步树数据 
import { getResult } from '@/utils/networkUtils';
import request from '@/utils/request';

// //获取小区以及楼栋
// export function GetBuildings(pstructid): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetBuildings?parentId=${pstructid}`)
//     .then(getResult as any);
// }

//获取下级
export function GetAsynChildBuildings(pstructid,type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildings?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

export function GetOrgTree(): Promise<any[]> {
    return request
      .get(process.env.basePath + `/Common/GetOrgTree`)
      .then(getResult as any);
}
