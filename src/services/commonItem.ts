import { getResult } from '@/utils/networkUtils';
import { TreeEntity } from '@/model/models';
import request from '@/utils/request';

export function getCommonItems(EnCode: string): Promise<Array<TreeEntity>> {
    return request
      .get(process.env.basePath + `/Common/GetDataItemTreeJson?EnCode=${EnCode}`)
      .then(getResult as any);
  }