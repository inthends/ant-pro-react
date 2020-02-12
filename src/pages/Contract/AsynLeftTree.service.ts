//获取异步树数据 
import { getResult } from '@/utils/networkUtils';
import request from '@/utils/request';

// //获取小区以及楼栋
// export function GetBuildings(pstructid): Promise<any[]> {
//   return request
//     .get(process.env.basePath + `/Common/GetBuildings?parentId=${pstructid}`)
//     .then(getResult as any);
// }

//获取合同管理房产下级，只加载到楼栋
export function GetAsynChildBuildingsForContract(pstructid,type): Promise<any[]> {
  return request
    .get(process.env.basePath + `/Common/GetAsynChildBuildingsForContract?parentId=${pstructid}&type=${type}`)
    .then(getResult as any);
}

export function GetOrgTree(): Promise<any[]> {
    return request
      .get(process.env.basePath + `/Common/GetOrgTree`)
      .then(getResult as any);
}
