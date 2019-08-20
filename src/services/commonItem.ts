import { getResult } from '@/utils/networkUtils';
import { TreeEntity } from '@/model/models';
import request from '@/utils/request';

//获取通用代码
export function getCommonItems(enCode: string): Promise<Array<TreeEntity>> {
    return request
      .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=${enCode}`)
      .then(getResult as any);
  }

  //查询客户数据
export function GetUserList(keyword,type): Promise<any> {
  return request
    .get(process.env.basePath + `/Common/GetUserList?keyword=${keyword}&type=${type}`)
    .then(getResult as any);
}