import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';


export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowTask/GetPageListJson`, {
      data: objToFormdata(data),
    })
    .then(getResult as any);
}

//审核
export function ApproveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowTask/ApproveForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}

//退回
export function RejectForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowTask/RejectForm`, { data: objToFormdata(data) })
    .then(getResult as any);
}